# Amorax - Documentação Técnica Completa

**Autor:** João Moretti  
**Versão:** 1.0  
**Data:** Janeiro 2026

---

## 1. Visão Geral do Projeto

A **Amorax** é uma plataforma digital premium para o mercado de acompanhantes adultos no Brasil. O sistema oferece um marketplace seguro e verificado que conecta anunciantes (acompanhantes) com usuários interessados em seus serviços, priorizando segurança, verificação de identidade e experiência do usuário.

### 1.1 Objetivos do Projeto

A plataforma foi desenvolvida com os seguintes objetivos principais:

1. **Segurança e Verificação**: Implementar um sistema robusto de verificação de identidade para garantir que todos os perfis sejam reais e verificados.

2. **Experiência Premium**: Oferecer uma interface moderna, elegante e intuitiva que transmita profissionalismo e confiança.

3. **Monetização Sustentável**: Criar um modelo de negócios baseado em assinaturas com planos diferenciados (Básico, Premium, VIP).

4. **Acessibilidade Multi-plataforma**: Disponibilizar a plataforma como PWA (Progressive Web App) para funcionar em qualquer dispositivo.

### 1.2 Segmentos Atendidos

A plataforma atende três categorias principais de anunciantes:

| Categoria | Descrição | Público-alvo |
|-----------|-----------|--------------|
| **Mulheres** | Acompanhantes femininas | Clientes masculinos e casais |
| **Homens** | Acompanhantes masculinos | Clientes femininas, masculinos e casais |
| **Travestis** | Acompanhantes trans | Todos os públicos |

---

## 2. Arquitetura Técnica

### 2.1 Stack Tecnológico

A Amorax foi construída utilizando tecnologias modernas e escaláveis:

| Camada | Tecnologia | Versão |
|--------|------------|--------|
| **Frontend** | React | 19.x |
| **Estilização** | Tailwind CSS | 4.x |
| **Componentes UI** | shadcn/ui | Latest |
| **Backend** | Express + tRPC | 4.x / 11.x |
| **Banco de Dados** | MySQL (TiDB) | 8.x |
| **ORM** | Drizzle ORM | 0.44.x |
| **Autenticação** | Manus OAuth + JWT | - |
| **Pagamentos** | Stripe | Latest |
| **Armazenamento** | AWS S3 | - |
| **Mapas** | Google Maps API | - |

### 2.2 Estrutura de Diretórios

```
amorax/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── components/        # Componentes reutilizáveis
│   │   ├── pages/             # Páginas da aplicação
│   │   ├── contexts/          # Contextos React
│   │   ├── hooks/             # Hooks customizados
│   │   └── lib/               # Utilitários e configurações
│   └── public/                # Assets estáticos
├── server/                    # Backend Express + tRPC
│   ├── routers.ts             # Rotas tRPC
│   ├── db.ts                  # Helpers de banco de dados
│   └── stripe/                # Integração Stripe
├── drizzle/                   # Schema do banco de dados
├── docs/                      # Documentação
└── scripts/                   # Scripts de manutenção
```

### 2.3 Modelo de Dados

O banco de dados é composto por 14 tabelas principais:

| Tabela | Descrição | Relacionamentos |
|--------|-----------|-----------------|
| `users` | Usuários do sistema | Base para autenticação |
| `advertiser_profiles` | Perfis de anunciantes | 1:1 com users |
| `profile_media` | Fotos e vídeos | N:1 com profiles |
| `reviews` | Avaliações | N:1 com profiles |
| `favorites` | Favoritos dos usuários | N:N users/profiles |
| `subscription_plans` | Planos de assinatura | Referência |
| `verification_requests` | Solicitações de verificação | N:1 com profiles |
| `appointments` | Agendamentos | N:1 com profiles |
| `availability_slots` | Horários disponíveis | N:1 com profiles |
| `blocked_dates` | Datas bloqueadas | N:1 com profiles |
| `conversations` | Conversas do chat | N:N users/profiles |
| `messages` | Mensagens do chat | N:1 com conversations |
| `profile_views` | Visualizações de perfil | Analytics |
| `payments` | Histórico de pagamentos | N:1 com users |

---

## 3. Funcionalidades do Sistema

### 3.1 Módulo de Autenticação

O sistema de autenticação utiliza OAuth 2.0 via Manus Auth, proporcionando login seguro e sem fricção.

**Fluxo de Autenticação:**
1. Usuário clica em "Entrar"
2. Redirecionamento para portal OAuth
3. Autenticação via provedor (Google, Apple, etc.)
4. Callback com token JWT
5. Sessão estabelecida via cookie seguro

### 3.2 Módulo de Perfis

Os anunciantes podem criar perfis completos com as seguintes informações:

**Informações Básicas:**
- Nome de exibição
- Categoria (Mulher, Homem, Trans)
- Biografia/Descrição
- Idade, altura, peso
- Características físicas (cor dos olhos, cabelo, tipo físico, etnia)

**Contato e Localização:**
- WhatsApp e Telegram
- Cidade, estado e bairro
- Coordenadas GPS para geolocalização
- Indicação de local próprio ou atendimento externo

**Preços e Pagamentos:**
- Preço por hora e por pernoite
- Formas de pagamento aceitas (PIX, cartão, dinheiro)

**Mídia:**
- Até 15 fotos (Premium) ou ilimitadas (VIP)
- Até 2 vídeos (Premium) ou ilimitados (VIP)
- Foto principal destacada

### 3.3 Módulo de Verificação

O sistema de verificação garante a autenticidade dos perfis:

| Tipo de Verificação | Descrição | Badge |
|---------------------|-----------|-------|
| **Documentos** | RG/CPF verificado | ✓ Documentos |
| **Idade** | Maior de 18 anos confirmado | ✓ Idade |
| **Fotos** | Selfie com documento | ✓ Fotos Reais |

**Processo de Verificação:**
1. Anunciante envia documentos via upload seguro
2. Equipe de moderação analisa documentos
3. Solicitação de selfie com documento
4. Aprovação ou rejeição com feedback
5. Badges aplicados ao perfil

### 3.4 Módulo de Agendamento

Sistema completo de agendamento para encontros:

**Para Usuários:**
- Seleção de data no calendário
- Visualização de horários disponíveis
- Escolha de duração (1h, 2h, pernoite)
- Seleção de local (próprio ou externo)
- Confirmação e envio de mensagem

**Para Anunciantes:**
- Configuração de disponibilidade por dia da semana
- Bloqueio de datas específicas
- Visualização de agendamentos em calendário semanal
- Confirmação, cancelamento e conclusão de agendamentos
- Estatísticas de agendamentos

### 3.5 Módulo de Chat

Sistema de mensagens em tempo real:

**Funcionalidades:**
- Criação automática de conversa ao enviar primeira mensagem
- Histórico completo de mensagens
- Indicador de mensagens não lidas
- Marcação de mensagens como lidas
- Interface responsiva para mobile

### 3.6 Módulo de Pagamentos

Integração completa com Stripe para monetização:

**Planos Disponíveis:**

| Plano | Mensal | Trimestral | Anual |
|-------|--------|------------|-------|
| **Básico** | R$ 49 | - | - |
| **Premium** | R$ 99 | R$ 249 (R$ 83/mês) | R$ 799 (R$ 67/mês) |
| **VIP** | R$ 199 | R$ 499 (R$ 166/mês) | R$ 1.599 (R$ 133/mês) |

**Benefícios por Plano:**

| Recurso | Básico | Premium | VIP |
|---------|--------|---------|-----|
| Perfil completo | ✓ | ✓ | ✓ |
| Fotos | 5 | 15 | Ilimitadas |
| Vídeos | 0 | 2 | Ilimitados |
| Posição na listagem | Padrão | Destaque | Topo |
| Badge especial | - | Premium | VIP |
| Estatísticas | Básicas | Completas | Avançadas |
| Suporte | Email | Chat | Prioritário |

### 3.7 Módulo de Geolocalização

Integração com Google Maps para busca por proximidade:

**Funcionalidades:**
- Busca por cidade e bairro
- Busca por raio de distância (km)
- Visualização de perfis no mapa
- Cálculo de distância do usuário
- Filtros combinados com localização

### 3.8 Módulo de Notificações

Sistema de notificações para engajamento:

**Tipos de Notificações:**
- Novas mensagens recebidas
- Agendamentos confirmados/cancelados
- Pagamentos processados
- Verificação aprovada/rejeitada
- Alertas do sistema

---

## 4. APIs do Sistema

### 4.1 Rotas tRPC

O backend expõe as seguintes rotas via tRPC:

**Auth Router:**
- `auth.me` - Retorna usuário autenticado
- `auth.logout` - Encerra sessão

**Profiles Router:**
- `profiles.list` - Lista perfis com filtros
- `profiles.getBySlug` - Obtém perfil por slug
- `profiles.getMyProfile` - Obtém perfil do usuário logado
- `profiles.create` - Cria novo perfil
- `profiles.update` - Atualiza perfil existente

**Media Router:**
- `media.getByProfile` - Lista mídia de um perfil
- `media.getByProfiles` - Lista mídia de múltiplos perfis
- `media.upload` - Upload de nova mídia
- `media.delete` - Remove mídia

**Appointments Router:**
- `appointments.create` - Cria agendamento
- `appointments.list` - Lista agendamentos
- `appointments.updateStatus` - Atualiza status

**Availability Router:**
- `availability.getSlots` - Obtém slots disponíveis
- `availability.setSlots` - Define slots
- `availability.getBlockedDates` - Obtém datas bloqueadas
- `availability.blockDate` - Bloqueia data

**Chat Router:**
- `chat.createConversation` - Inicia conversa
- `chat.getConversations` - Lista conversas
- `chat.getMessages` - Obtém mensagens
- `chat.sendMessage` - Envia mensagem
- `chat.markAsRead` - Marca como lido

**Payments Router:**
- `payments.createCheckoutSession` - Cria sessão Stripe
- `payments.getSubscription` - Obtém assinatura ativa

---

## 5. Segurança

### 5.1 Medidas de Segurança Implementadas

| Área | Medida | Descrição |
|------|--------|-----------|
| **Autenticação** | OAuth 2.0 + JWT | Tokens seguros com expiração |
| **Sessões** | Cookies HttpOnly | Proteção contra XSS |
| **Dados** | HTTPS obrigatório | Criptografia em trânsito |
| **Pagamentos** | Stripe PCI-DSS | Conformidade com padrões |
| **Uploads** | Validação de tipo | Apenas imagens/vídeos permitidos |
| **SQL** | Prepared Statements | Proteção contra SQL Injection |

### 5.2 Privacidade

- Dados sensíveis nunca são expostos na API
- Informações de contato visíveis apenas para usuários logados
- Opção de ocultar perfil temporariamente
- Exclusão de conta com remoção de dados

---

## 6. Performance e Escalabilidade

### 6.1 Otimizações Implementadas

**Frontend:**
- Code splitting por rota
- Lazy loading de imagens
- Cache de assets estáticos
- Compressão gzip/brotli

**Backend:**
- Connection pooling para banco de dados
- Cache de queries frequentes
- Paginação em listagens
- Índices otimizados no banco

### 6.2 Métricas de Performance

| Métrica | Alvo | Atual |
|---------|------|-------|
| First Contentful Paint | < 1.5s | ~1.2s |
| Time to Interactive | < 3s | ~2.5s |
| Lighthouse Score | > 90 | 92 |

---

## 7. Deployment e Infraestrutura

### 7.1 Ambiente de Produção

A plataforma está hospedada na infraestrutura Manus com:

- **CDN**: Distribuição global de assets
- **SSL**: Certificado automático
- **Backup**: Diário automático
- **Monitoramento**: Logs e métricas em tempo real

### 7.2 PWA (Progressive Web App)

A aplicação funciona como PWA com:

- **Manifest**: Configuração completa para instalação
- **Service Worker**: Cache offline e notificações push
- **Responsivo**: Adaptação para todos os tamanhos de tela
- **Instalável**: Ícone na home screen do dispositivo

---

## 8. Manutenção e Suporte

### 8.1 Scripts de Manutenção

```bash
# Migração de banco de dados
pnpm db:push

# Executar testes
pnpm test

# Build de produção
pnpm build

# Verificação de tipos
pnpm check
```

### 8.2 Logs e Monitoramento

- Logs de erro no console do servidor
- Métricas de uso via analytics
- Alertas de falhas via notificação

---

## 9. Roadmap Futuro

### 9.1 Próximas Funcionalidades

1. **Verificação por Vídeo**: Chamada de vídeo para verificação em tempo real
2. **Sistema de Reputação**: Score baseado em avaliações e comportamento
3. **Pagamento In-app**: Pagamento de serviços dentro da plataforma
4. **App Nativo**: Versões iOS e Android nativas
5. **IA para Moderação**: Detecção automática de conteúdo impróprio

### 9.2 Melhorias Planejadas

- Otimização de SEO para melhor ranqueamento
- Integração com redes sociais
- Sistema de indicação com recompensas
- Dashboard de analytics avançado

---

## 10. Contato e Suporte

**Desenvolvido por:** João Moretti  
**Email:** suporte@amorax.com.br  
**Website:** https://amorax.com.br

---

*Documento gerado em Janeiro de 2026. Todos os direitos reservados.*
