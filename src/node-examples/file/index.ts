import fs from "fs";

export const writeFile = function () {
  const fileName = process.argv[3];
  const fileContent = process.argv[4];

  if (!!fileName && !!fileContent) {
    fs.writeFile(fileName, fileContent, (error) => {
      if (error) {
        throw error;
      }

      console.log(`Arquivo ${fileName} foi salvo com sucesso!`);
    });
  }
};
