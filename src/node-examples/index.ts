import { fatorial } from "./fatorial";
import { writeFile } from "./file";
import yargs from 'yargs';

console.log(`Executando o script a partir do diretório ${process.cwd()}`);

process.on("exit", () => {
  console.log("script está prestes a terminar");
});

const argv = yargs.options({
  example: {demandOption: true},
  number: {type: "number"},
  fileName: {type: 'string'},
  fileContent: {type: 'string'}
}).argv;
const scriptOption = argv.example;

switch (scriptOption) {
  case "fatorial": {
    const number = argv.number;

    if (number) {
      console.log(`O fatorial de ${number} = ${fatorial(number)}`);
    } else {
      console.log("nenhum numero foi passado para o calculo do fatorial!");
    }
  }
  break;

  case "file": {
      writeFile(argv.fileName, argv.fileContent);
  }
  break;

  default: {
      console.log('Invalid option!!');
  }
}
