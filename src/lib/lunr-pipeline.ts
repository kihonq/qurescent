/**
 * Lunr pipeline that keeps Arabic tokens intact.
 * Stock `lunr.trimmer` uses `\W` and wipes Arabic script entirely.
 */
import lunr from "lunr";

const TRIMMER_NAME = "qurescentUnicodeTrimmer";
const STEMMER_NAME = "qurescentSelectiveStemmer";

type PipelineFns = Record<string, lunr.PipelineFunction>;

function pipelineFns(lunrLib: typeof lunr): PipelineFns {
  return (lunrLib.Pipeline as unknown as { registeredFunctions: PipelineFns })
    .registeredFunctions;
}

function unicodeTrimmer(token: lunr.Token): lunr.Token {
  return token.update((s) =>
    s.replace(/^[^\p{L}\p{N}]+/u, "").replace(/[^\p{L}\p{N}]+$/u, ""),
  );
}

function selectiveStemmer(token: lunr.Token): lunr.Token {
  if (/[\u0600-\u06FF]/.test(token.toString())) return token;
  return lunr.stemmer(token);
}

/** Register pipeline fns before build or Index.load (names must match). */
export function registerQurescentLunrPipeline(
  lunrLib: typeof lunr = lunr,
): void {
  const registered = pipelineFns(lunrLib);
  if (!registered[TRIMMER_NAME]) {
    lunrLib.Pipeline.registerFunction(unicodeTrimmer, TRIMMER_NAME);
  }
  if (!registered[STEMMER_NAME]) {
    lunrLib.Pipeline.registerFunction(selectiveStemmer, STEMMER_NAME);
  }
}

/** Apply pipeline on a Builder (`this` inside `lunr(function () { … })`). */
export function useQurescentLunrPipeline(builder: lunr.Builder): void {
  registerQurescentLunrPipeline(lunr);
  const registered = pipelineFns(lunr);
  const trimmer = registered[TRIMMER_NAME];
  const stemmer = registered[STEMMER_NAME];
  if (!trimmer || !stemmer) {
    throw new Error("Qurescent Lunr pipeline failed to register");
  }
  builder.pipeline.reset();
  builder.searchPipeline.reset();
  builder.pipeline.add(trimmer, lunr.stopWordFilter, stemmer);
  builder.searchPipeline.add(stemmer);
}
