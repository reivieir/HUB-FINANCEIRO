import fs from "fs";
import mammoth from "mammoth";
import path from "path";

const pastaDocs = "./documents";
const output = "./knowledge/baseConhecimento.json";

async function processarDocs() {

  const arquivos = fs.readdirSync(pastaDocs);

  const base = [];

  for (const arquivo of arquivos) {

    if (!arquivo.endsWith(".docx")) continue;

    const caminho = path.join(pastaDocs, arquivo);

    const result = await mammoth.extractRawText({ path: caminho });

    base.push({
      titulo: arquivo,
      conteudo: result.value
    });

  }

  fs.writeFileSync(output, JSON.stringify(base, null, 2));

  console.log("Base de conhecimento criada!");

}

processarDocs();
