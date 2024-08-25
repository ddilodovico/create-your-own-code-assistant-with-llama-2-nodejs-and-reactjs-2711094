import { Injectable } from '@nestjs/common';
import * as hub from 'langchain/hub';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { END, MemorySaver, START, StateGraph } from '@langchain/langgraph';

interface RAGState {
  question: string;
  generation: string;
  documents: Document[];
}


@Injectable()
export class RagService {
  ragChain: any;
  graph: any;

  constructor(private ollamaService: OllamaService) {
    hub.pull('sde/rag-prompt').then((module) => {
      this.ragChain = module
        .pipe(this.ollamaService.chat)
        .pipe(new StringOutputParser());
    });
  }

  async run(question: string): Promise<string> {
    const app = this.graph.compile({
      checkpointer: MemorySaver,
    });
    return app.invoke(question);
  }

  async setupGraph(_graphState: RAGState) {
    this.graph = new StateGraph({
      channels: _graphState,
    });
  }
}
