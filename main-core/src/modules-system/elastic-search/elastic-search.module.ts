import { Global, Module, OnModuleInit } from '@nestjs/common';
import {
  ElasticsearchModule,
  ElasticsearchService,
} from '@nestjs/elasticsearch';
import {
  ELASTICSEARCH_USERNAME,
  ELASTICSEARCH_PASSWORD,
  ELASTICSEARCH_URL,
} from 'src/common/constant/app.constant';

@Global()
@Module({
  imports: [
    ElasticsearchModule.register({
      node: ELASTICSEARCH_URL,
      auth: {
        username: ELASTICSEARCH_USERNAME!,
        password: ELASTICSEARCH_PASSWORD!,
      },
      tls: {
        rejectUnauthorized: false,
      },
    }),
  ],
  exports: [ElasticsearchModule],
})
export class ElasticSearchModule implements OnModuleInit {
  constructor(private elasticSearch: ElasticsearchService) {}

  async onModuleInit() {
    // Kiểm tra kết nối
    try {
      const result = await this.elasticSearch.ping();
      console.log('✅ ElasticSearch connected', result);
    } catch (error) {
      console.log('❌ ElasticSearch failed', error);
    }
  }
}
