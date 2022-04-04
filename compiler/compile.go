package main

import (
	"io/fs"
	"os/exec"
	"strings"
	"time"

	"path/filepath"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type Data struct {
	Url  string `json:"url"`
	Path string `json:"path"`
}

func main() {
	app := fiber.New(fiber.Config{})

	app.Get("/", func(c *fiber.Ctx) error {
		// p := new(Data)
		// if err := c.BodyParser(p); err != nil {
		// 	return err
		// }
		id := uuid.New().String()
		// clone from github
		println("start clone")
		clone := exec.Command("git", "clone", "https://github.com/CrosszPai/cube-test", "/app/temp/"+id+"/"+id)
		_, err := clone.Output()
		if err != nil {
			return c.SendString(err.Error())
		}

		// read .ioc file name
		filename := ""
		println("start read .ioc file")
		filepath.WalkDir("/app/temp/"+id, func(s string, d fs.DirEntry, e error) error {
			if filepath.Ext(d.Name()) == ".ioc" {
				name := strings.TrimSuffix(d.Name(), filepath.Ext(d.Name()))
				// println(name)
				filename = filename + name
			}
			return nil
		})

		// rename folder
		println("start rename folder")
		rename := exec.Command("mv", "/app/temp/"+id+"/"+id+"/", "/app/temp/"+id+"/"+filename)
		_, err = rename.Output()
		if err != nil {
			return c.SendString(err.Error())
		}

		time.Sleep(time.Second * 5)
		{
			find, _ := exec.Command("ls", "/app/temp/"+id).Output()
			println(string(find))
		}
		// compile code
		println("start compile")
		compile := exec.Command("sh", "-c", "/opt/st/stm32cubeide_1.9.0/headless-build.sh -build "+filename+" -data /app/temp/"+id+" -importAll /app/temp/"+id)
		_, err = compile.Output()
		if err != nil {
			println(err.Error())
			return c.SendString(err.Error())
		}
		err = c.Download("/app/temp/" + id + "/" + filename + "/Release/" + filename + ".elf")
		if err != nil {
			return c.SendString(err.Error())
		}
		// remove folder
		println("start remove folder")
		remove := exec.Command("rm", "-rf", "/app/temp/"+id)
		_, err = remove.Output()
		if err != nil {
			return c.SendString(err.Error())
		}
		return nil
	})
	app.Listen(":4444")
}
