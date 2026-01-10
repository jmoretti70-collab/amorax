# Amorax - Plataforma de Acompanhantes

## Fase 1: Banco de Dados e Estrutura Base
- [x] Schema do banco de dados (usuários, perfis, categorias, serviços, planos)
- [x] Configuração de tema visual (dark mode, cores premium rosa/magenta)
- [x] Estrutura de rotas da aplicação

## Fase 2: Sistema de Autenticação e Onboarding
- [x] Fluxo de cadastro para anunciantes (página de onboarding completa)
- [x] Sistema de verificação de documentos (UI implementada)
- [x] Verificação de fotos (selfie com documento) (UI implementada)
- [x] Badges de verificação (documentos, idade, fotos reais)

## Fase 3: Páginas Públicas
- [x] Landing page com seleção de categoria (Mulheres, Homens, Travestis)
- [x] Página de listagem de perfis com grid de cards
- [x] Página de perfil individual completo
- [x] Galeria de fotos e vídeos
- [x] Informações de contato (WhatsApp, Telegram)

## Fase 4: Área Administrativa para Anunciantes
- [x] Dashboard com estatísticas de visualizações
- [x] Gerenciamento de perfil (fotos, vídeos, descrição)
- [x] Configuração de serviços oferecidos
- [x] Configuração de horários e disponibilidade
- [x] Configuração de preços e formas de pagamento aceitas

## Fase 5: Geolocalização e Filtros
- [x] Integração com Google Maps (página de mapa)
- [x] Busca por cidade e bairro
- [x] Busca por proximidade (raio em km)
- [x] Filtros avançados (idade, características, serviços, preço)
- [x] Ordenação por relevância, distância, avaliação

## Fase 6: Sistema de Planos e Pagamentos
- [x] Plano Gratuito (básico)
- [x] Plano Premium (destaque na listagem)
- [x] Plano VIP (topo da listagem + badge especial)
- [ ] Integração de pagamento (PIX, cartão) - pendente Stripe
- [ ] Gestão de assinaturas - pendente integração

## Fase 7: PWA e Otimizações
- [x] Configuração do manifest.json
- [x] Service Worker para funcionamento offline
- [x] Ícones e splash screens
- [ ] Otimização de performance
- [ ] SEO e meta tags

## Fase 8: Documentação
- [x] Especificação técnica completa
- [x] Modelo de negócios e DRE
- [x] Documentação legal e fiscal
- [ ] Manual do anunciante


## Fase 9: Atualização de Logotipo e Sistema de Agendamento
- [x] Atualizar logotipo em todo o projeto (Conceito 1 - Amora Coração)
- [x] Criar favicon com novo logotipo
- [x] Atualizar manifest.json com novo logotipo
- [x] Criar tabelas de agendamento no banco de dados
- [x] Implementar APIs de agendamento (criar, listar, cancelar, confirmar)
- [x] Criar página de agendamento para usuários
- [x] Criar gestão de agenda no dashboard do anunciante
- [x] Configurar disponibilidade de horários
- [ ] Sistema de notificações de agendamento
- [ ] Testes do sistema de agendamento


## Fase 10: Correção de Erros
- [x] Substituir logotipo Amora Coração em todo o site
- [x] Corrigir sistema de agenda que não está funcionando
- [x] Criar dados de demonstração (seed) no banco de dados
- [x] Verificar e corrigir erros de TypeScript
- [x] Verificar e corrigir erros de importação
- [x] Verificar e corrigir erros de runtime
- [x] Testar todas as páginas e funcionalidades
- [x] Validar testes unitários

## Fase 11: Implementação de Sugestões

- [x] Padronizar logotipo (80-90px) em todas as páginas
- [x] Integrar pagamentos com Stripe
- [x] Adicionar perfis de demonstração em outras cidades (RJ, BH, etc)
- [x] Gerar fotos para seção de Homens
- [x] Gerar fotos para seção de Travestis
- [x] Atualizar banco de dados com novos perfis e fotos
- [x] Corrigir listagem para buscar dados do banco de dados via API
- [x] Adicionar rota getByProfiles para mídia
- [x] Testar todas as funcionalidades - Mulheres, Homens e Travestis funcionando
