//written by o1-preview model

export class AutoComplete {
  private corpus: string[];
  private wordFrequencyMap: Map<string, number>;
  private wordPrefixMap: Map<string, Map<string, number>>;
  private bigramMap: Map<string, Map<string, number>>;
  private contextualPrefixMap: Map<string, Map<string, Map<string, number>>>;

  constructor(sentences: string[]) {
    this.corpus = sentences;
    this.wordFrequencyMap = new Map();
    this.wordPrefixMap = new Map();
    this.bigramMap = new Map();
    this.contextualPrefixMap = new Map();

    this.buildDataStructures();
  }

  private buildDataStructures() {
    for (const sentence of this.corpus) {
      const words = sentence.split(/\s+/);
      for (let i = 0; i < words.length; i++) {
        const word = words[i];

        // Update word frequency
        this.wordFrequencyMap.set(
          word,
          (this.wordFrequencyMap.get(word) || 0) + 1
        );

        // Build prefix map for word completion with frequencies (non-contextual)
        for (let j = 1; j <= word.length; j++) {
          const prefix = word.substring(0, j).toLowerCase();
          if (!this.wordPrefixMap.has(prefix)) {
            this.wordPrefixMap.set(prefix, new Map());
          }
          const prefixMap = this.wordPrefixMap.get(prefix)!;
          prefixMap.set(word, this.wordFrequencyMap.get(word)!);
        }

        // Build bigram map for next-word suggestion
        if (i < words.length - 1) {
          const nextWord = words[i + 1];
          if (!this.bigramMap.has(word)) {
            this.bigramMap.set(word, new Map());
          }
          const nextWords = this.bigramMap.get(word)!;
          nextWords.set(nextWord, (nextWords.get(nextWord) || 0) + 1);
        }

        // Build contextual prefix map for context-aware autocompletion
        // Using previous word
        if (i > 0) {
          const prevWord = words[i - 1];
          const contextKey1 = prevWord;

          if (!this.contextualPrefixMap.has(contextKey1)) {
            this.contextualPrefixMap.set(contextKey1, new Map());
          }
          const contextMap1 = this.contextualPrefixMap.get(contextKey1)!;

          for (let j = 1; j <= word.length; j++) {
            const prefix = word.substring(0, j).toLowerCase();
            if (!contextMap1.has(prefix)) {
              contextMap1.set(prefix, new Map());
            }
            const completionsMap = contextMap1.get(prefix)!;
            completionsMap.set(word, (completionsMap.get(word) || 0) + 1);
          }
        }

        // Using previous two words
        if (i > 1) {
          const prevWord1 = words[i - 2];
          const prevWord2 = words[i - 1];
          const contextKey2 = `${prevWord1} ${prevWord2}`;

          if (!this.contextualPrefixMap.has(contextKey2)) {
            this.contextualPrefixMap.set(contextKey2, new Map());
          }
          const contextMap2 = this.contextualPrefixMap.get(contextKey2)!;

          for (let j = 1; j <= word.length; j++) {
            const prefix = word.substring(0, j).toLowerCase();
            if (!contextMap2.has(prefix)) {
              contextMap2.set(prefix, new Map());
            }
            const completionsMap = contextMap2.get(prefix)!;
            completionsMap.set(word, (completionsMap.get(word) || 0) + 1);
          }
        }
      }
    }
  }

  public getSuggestions(input: string): string[] {
    const isEndingWithSpace = input.endsWith(" ");
    input = input.trim();
    const tokens = input.split(/\s+/);
    let suggestions: string[] = [];

    if (isEndingWithSpace && tokens.length > 0) {
      // Suggest next words based on the last word
      const lastWord = tokens[tokens.length - 1];
      const nextWordsMap = this.bigramMap.get(lastWord);
      if (nextWordsMap) {
        suggestions = Array.from(nextWordsMap.entries())
          .sort((a, b) => b[1] - a[1])
          .map((entry) => entry[0]);
      } else {
        // Suggest the most frequent words if no bigram found
        suggestions = Array.from(this.wordFrequencyMap.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map((entry) => entry[0]);
      }
    } else if (tokens.length > 0) {
      // Suggest word completions based on the current word prefix and context
      const currentWord = tokens[tokens.length - 1];
      const prefix = currentWord.toLowerCase();

      // Build context keys
      let contextKeys: string[] = [];

      if (tokens.length >= 3) {
        const prevWord1 = tokens[tokens.length - 3];
        const prevWord2 = tokens[tokens.length - 2];
        const contextKey2 = `${prevWord1} ${prevWord2}`;
        contextKeys.push(contextKey2);
      }

      if (tokens.length >= 2) {
        const prevWord = tokens[tokens.length - 2];
        const contextKey1 = prevWord;
        contextKeys.push(contextKey1);
      }

      let completionsMap: Map<string, number> | undefined;

      // Try to find completions using the context keys
      for (const contextKey of contextKeys) {
        if (this.contextualPrefixMap.has(contextKey)) {
          const contextMap = this.contextualPrefixMap.get(contextKey)!;
          if (contextMap.has(prefix)) {
            completionsMap = contextMap.get(prefix);
            break;
          }
        }
      }

      // If no context-aware completions, fall back to non-contextual completions
      if (!completionsMap && this.wordPrefixMap.has(prefix)) {
        completionsMap = this.wordPrefixMap.get(prefix);
      }

      if (completionsMap) {
        suggestions = Array.from(completionsMap.entries())
          .sort((a, b) => b[1] - a[1])
          .map((entry) => entry[0]);
      } else {
        suggestions = [];
      }
    } else {
      // If input is empty, suggest the most frequent words
      suggestions = Array.from(this.wordFrequencyMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map((entry) => entry[0]);
    }

    return suggestions;
  }
}
