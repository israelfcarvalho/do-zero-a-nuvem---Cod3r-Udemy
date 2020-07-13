import fs from "fs";

export const writeFile = function (fileName?: string, fileContent?: string) {
  if (!!fileName && !!fileContent) {
    fs.writeFile(fileName, fileContent, (error) => {
      if (error) {
        throw error;
      }

      console.log(`Arquivo ${fileName} foi salvo com sucesso!`);
    });
  } else {
    console.log(`you must pass flags --fileName and --fileContent`);
  }
};
