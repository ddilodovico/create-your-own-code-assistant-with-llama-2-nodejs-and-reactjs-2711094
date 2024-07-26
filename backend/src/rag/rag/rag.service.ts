import { Injectable } from '@nestjs/common';
import { END, MemorySaver, START, StateGraph } from '@langchain/langgraph';
import { OllamaService } from 'src/ollama/ollama.service';
import * as hub from 'langchain/hub';
import { StringOutputParser } from '@langchain/core/output_parsers';
import type { Document } from '@langchain/core/documents';
import { RetrieverService } from '../retriever/retriever.service';
import { Utils } from '../utils/utils';

interface RAGState {
  question: string;
  generation: string;
  documents: Document[];
}

@Injectable()
export class RagService {
  ragChain: any;
  graph: any;
  constructor(
    private ollamaService: OllamaService,
    private retrieverService: RetrieverService,
  ) {
    hub.pull('sde/rag-prompt').then((module) => {
      this.ragChain = module
        .pipe(this.ollamaService.chat)
        .pipe(new StringOutputParser());
    });
  }

  async run(question: string) {
    const app = this.graph.compile({
      checkpointer: MemorySaver,
    });
    app.invoke(question);
  }

  async setupGraph(_graphState: typeof graphState) {
    this.graph = new StateGraph({
      channels: _graphState,
    });
    // nodes
  }
  async retrieve(state: RAGState) {
    const documents = await this.retrieverService
      .getRetriever()
      .invoke(state.question);
    return { documents };
  }

  async generate(state: RAGState) {
    const generation = await this.ragChain.invoke({
      context: Utils.formatDocs(state.documents),
      question: state.question,
    });

    return { generation };
  }
}