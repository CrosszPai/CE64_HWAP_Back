import assert = require("assert");
import {
  Arg,
  Authorized,
  Mutation,
  Query,
  Resolver,
  Ctx,
  Args,
  FieldResolver,
  Root,
} from "type-graphql";
import { Repository } from "typeorm";
import { CreateLabArgs } from "../Args/createLab.args";
import { fileType } from "../enum/filetype.enum";
import { Assets } from "../schema/assets.schema";
import Lab from "../schema/lab.schema";
import User, { Role } from "../schema/user.schema";
import { AppContext } from "../type";
import { db } from "../utils/db";
import uploadFile from "../utils/uploadFile";

@Resolver(Lab)
class LabResolver {
  labRepository: Repository<Lab>;
  userRepository: Repository<User>;
  assetRepository: Repository<Assets>
  constructor(
  ) {
    this.labRepository = db.getRepository(Lab)
    this.userRepository = db.getRepository(User)
    this.assetRepository = db.getRepository(Assets)
  }

  @Query((returns) => Lab)
  async lab(@Arg("id") id: number) {
    return await this.labRepository.findOne({
      where: {
        id
      },
      relations: {
        assets: true
      }
    });
  }

  @Authorized()
  @Query((returns) => [Lab])
  async labs() {
    const labs = await this.labRepository.find();
    return labs;
  }

  @Authorized()
  @Query((returns) => [Lab])
  async selfLabs(@Ctx() ctx: AppContext) {
    const octokit = ctx.userOctokit;
    assert(octokit, "Unauthorize");
    const githubUser = (await octokit.request("GET /user")).data;
    const user = await this.userRepository.findOne({
      where: {
        id: githubUser.id
      }
    });
    if (user?.id) {
      const labs = await this.labRepository.find({
        where: {
          owner: user,
        },
        relations: ["assets"],
      });
      console.log(labs);

      return labs;
    } else {
      return [];
    }
  }

  @Authorized(Role.instructor, Role.admin)
  @Mutation((returns) => Lab)
  async createLab(@Ctx() ctx: AppContext, @Args() args: CreateLabArgs) {
    const octokit = ctx.userOctokit;
    assert(octokit, "Unauthorize");
    const githubUser = (await octokit.request("GET /user")).data;
    const user = await this.userRepository.findOne({
      where: {
        id: githubUser.id
      }
    });
    // if user not found throw error
    if (!user) {
      throw new Error("User not found");
    }
    
    let lab = await this.labRepository.save({
      lab_name: args.lab_name,
      lab_detail: args.lab_detail,
      owner: user,
      published: args.published,
      repo_url: args.repo_url,
    });
    const fullfilled = await Promise.all(
      (args.assets ?? []).map(async (asset) => await asset)
    );

    let uploaded_urls = await uploadFile(
      fullfilled,
      fileType.lab_assets,
      lab.id?.toString()
    );
    let assets = await Promise.all(
      fullfilled.map((_, index) => {
        return this.assetRepository.save({
          url: uploaded_urls[index].path,
          lab: lab,
        });
      })
    );
    lab.assets = assets;

    return lab;
  }

  @FieldResolver()
  async assets(@Root() lab: Lab) {
    return lab.assets?.map(async (asset) => ({
      ...asset,
      url: "http://localhost:8888/" + asset.url,
    }));
  }

  @Authorized()
  @Query((returns) => [Lab])
  async publishedLab(@Ctx() ctx: AppContext) {
    return await this.labRepository.find({
      where: {
        published: true,
      },
      relations: ["assets"]
    });
  }
}

export default LabResolver;
