import { fatorial } from "./fatorial";
import { writeFile } from "./file";

console.log(`Executando o script a partir do diretório ${process.cwd()}`);

process.on("exit", () => {
  console.log("script está prestes a terminar");
});

const scriptOption = process.argv[2];

switch (scriptOption) {
  case "fatorial": {
    const number = parseInt(process.argv[3] || "0");

    if (process.argv[3] && !isNaN(number)) {
      console.log(`O fatorial de ${number} = ${fatorial(number)}`);
    } else {
      console.log("nenhum numero foi passado para o calculo do fatorial!");
    }
  }
  break;

  case "file": {
      writeFile();
  }
  break;

  default: {
      console.log('Invalid option!!');
  }
}
