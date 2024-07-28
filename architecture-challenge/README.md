# Proposta de System Design para uma aplicação parecida com o Pinterest.

Desenvolver uma plataforma semelhante ao Pinterest é uma tarefa complexa, dada a diversidade e a sofisticação dos serviços envolvidos.
Após a leitura de alguns [papers](https://read.engineerscodex.com/p/how-pinterest-scaled-to-11-million) e principalmente, do [blog de engenharia do Pinterest](https://medium.com/pinterest-engineering), compilei alguns números e soluções para os principais casos de uso propostos:
* Como lidar com formatos de mídia diferentes (imagens, vídeos, links) e de origem diferente (criado por usuário, gerado pela plataforma, ADs, conteúdo externo - que redireciona para um site);
* Recomendação de conteúdos relevantes para o usuário;
* Possibilidade ao usuário salvar o conteúdo em pastas, curtir e comentar um conteúdo;

Considerando que a plataforma terá aproximadamente 100 mil usuários ativos e baseando-nos em alguns números adaptados do próprio Pinterest para a nossa base de usuários, vamos realizar alguns cálculos importantes que nossa infraestrutura deve suportar:

#### Atividades Diárias dos Usuários
##### Uploads
* 3 Fotos (5mb) QPS = ~3.45
* 1 Video (15mb) QPS = ~1.15
* 2 Links QPS = ~2.30

##### Interações
* 8 curtidas QPS = ~9.25
* 2 comentários QPS = ~2.30
* 1 pasta/semana (~0.14 por dia) QPS = ~0.16
* 2 conteúdos movidos para pasta QPS = ~2.30


#### Podemos separar nos seguintes grupos:

##### Media Service
Responsável por uploads de fotos, vídeos e links.
* Fotos: ~3.45 QPS
* Vídeos: ~1.15 QPS
* Links: ~2.30 QPS

Total: ~6.90 QPS

##### Interação Social
Responsável por curtidas, comentários, criação de pastas e movimentação de conteúdos.
* curtidas: ~9.25 QPS
* comentários: ~2.30 QPS
* 1 pasta/semana: ~0.16 QPS
* 2 conteúdos movidos para pasta: ~2.30 QPS

Total: ~14 QPS

##### Engine de recomendação
* total de ações / 24h = ~21 QPS

Com base nisso, podemos montar um arquitetura da seguinte forma:
[![dItLUpj.md.png](https://iili.io/dItLUpj.md.png)]

Trata-se de uma arquitetura amplamente utilizada no mercado, que já se provou funcional e com a qual a maioria dos desenvolvedores e DevOps já estão familiarizados.

##### Media Service: 
Será responsável por gerenciar o upload de mídias, suportando diversos tipos como imagens, vídeos e links, provenientes de várias fontes, incluindo uploads de usuários, anúncios externos e internos da plataforma, entre outros, e organizar esses conteúdos conforme a separação em pastas criada pelos usuários. Para cada upload, eventos serão gerados e processados por outro serviço, permitindo um rastreamento completo dos engajamentos e do perfil do usuário. Além disso, este serviço será responsável por comprimir e analisar conteúdos sensíveis.

##### Interação Social:
Serviço responsável pela interação dos usuários com os conteúdos, incluindo curtidas, compartilhamentos, comentários e salvamento de conteúdos, entre outros. Assim como o serviço de mídia, ele também gerará eventos que serão consumidos pelo serviço de recomendação e insights.

##### Recomendation Engine
Responsável por processar os eventos gerados pelos serviços de mídia e de interação de conteúdos, utilizando esses dados para fornecer recomendações personalizadas aos usuários. Ele analisará padrões de engajamento e comportamento, ajustando as recomendações com base em curtidas, compartilhamentos, comentários, uploads e organização de pastas. O objetivo é melhorar a experiência do usuário, oferecendo conteúdos relevantes e de seu interesse. Além disso, este serviço ajudará a gerar insights valiosos sobre o perfil e as preferências dos usuários, contribuindo para ads personalizados.

### Tecnologias Envolvidas:
As tecnologias envolvidas entre os três serviços serão basicamente as seguintes:

##### Banco de Dados:
* Relacional: Postgres (Cloud SQL GCP / Aurora AWS)
* Não Relacional: Cassandra / ScyllaDB (GCP Compute Engine / EC2 AWS)
* Busca/Análise de Dados: Elasticsearch (Elastic GCP / AWS OpenSearch Service)
* Cache: Redis (GCP Memorystore / AWS ElastiCache)
* Big Data: BigQuery (GCP) / Redshift (AWS)

##### Serverless:
* Cloud Functions (GCP) / Lambda (AWS)

##### Orquestração de Containers:
* Kubernetes (GKE GCP / EKS AWS)
* API Gateway: Kong

##### Monitoramento/Logging:
* Prometheus
* Loki
* Cloud Monitoring (GCP) / CloudWatch (AWS)

##### Serviço de Autenticação:
* Keycloak (Identity Platform GCP / Cognito AWS)

##### Armazenamento de Arquivos:
* Cloud Storage (GCP) ou S3 (AWS), ambos com CDN provider

##### Message Broker:
* RabbitMQ / Kafka (Pub/Sub GCP / SQS/SNS e MSK AWS)

##### Ferramentas de Compressão:
* Sharp
* FFmpeg

##### CI/CD (Integração Contínua/Entrega Contínua):
* Jenkins
* Cloud Build (GCP)
* CodeBuild (AWS)

O mais importante para escolher as tecnologias é considerar o lock-in com um provedor de nuvem ou o uso de ferramentas open source self-hosted. Além disso, a região geográfica escolhida também terá impacto direto nos custos. Alguns serviços podem ser até 20% mais caros se forem hospedados em São Paulo nos provedores de nuvem. No entanto, o tempo de resposta será menor para os usuários, considerando que a plataforma será utilizada por brasileiros ou falantes da língua portuguesa.

#### Créditos: 
* https://highscalability.com/scaling-pinterest-from-0-to-10s-of-billions-of-page-views-a/
* https://medium.com/pinterest-engineering/pacer-pinterests-new-generation-of-asynchronous-computing-platform-5c338a15d2a0
* https://medium.com/pinterest-engineering/large-scale-user-sequences-at-pinterest-78a5075a3fe9
* https://datareportal.com/essential-pinterest-stats
* ChatGPT pela resumo de artigos e correção de texto.