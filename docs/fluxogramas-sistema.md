# Amorax - Fluxogramas do Sistema

**Autor:** João Moretti  
**Versão:** 1.0  
**Data:** Janeiro 2026

---

## Índice

1. [Visão Geral do Sistema](#1-visão-geral-do-sistema)
2. [Fluxo de Autenticação](#2-fluxo-de-autenticação)
3. [Fluxo de Cadastro de Anunciante](#3-fluxo-de-cadastro-de-anunciante)
4. [Fluxo de Agendamento](#4-fluxo-de-agendamento)
5. [Fluxo de Pagamentos](#5-fluxo-de-pagamentos)
6. [Fluxo de Verificação](#6-fluxo-de-verificação)

---

## 1. Visão Geral do Sistema

O diagrama abaixo apresenta a arquitetura geral do sistema Amorax, mostrando as interações entre os diferentes atores (Usuários, Anunciantes e Administradores) e os componentes do sistema.

![Fluxo Geral do Sistema](fluxogramas/fluxo-geral-sistema.png)

### Componentes Principais

| Componente | Descrição |
|------------|-----------|
| **API tRPC** | Camada de comunicação entre frontend e backend |
| **Banco de Dados** | MySQL/TiDB para persistência de dados |
| **Autenticação OAuth** | Sistema de login via Manus Auth |
| **Stripe Pagamentos** | Processamento de pagamentos e assinaturas |
| **Google Maps** | Geolocalização e busca por proximidade |
| **Notificações** | Sistema de alertas e comunicação |
| **Storage S3** | Armazenamento de fotos e vídeos |

---

## 2. Fluxo de Autenticação

O fluxo de autenticação utiliza OAuth 2.0 para garantir segurança e facilidade de uso. O usuário pode se autenticar via Google, Apple ou email.

![Fluxo de Autenticação](fluxogramas/fluxo-autenticacao.png)

### Etapas do Processo

1. **Acesso Inicial**: Usuário acessa a plataforma Amorax
2. **Verificação de Sessão**: Sistema verifica se existe sessão ativa
3. **Redirecionamento OAuth**: Se não logado, redireciona para portal de autenticação
4. **Escolha de Provedor**: Usuário escolhe Google, Apple ou email
5. **Autenticação**: Processo de login no provedor escolhido
6. **Callback**: Retorno com token de autenticação
7. **Criação de Sessão**: JWT gerado e cookie de sessão definido
8. **Acesso Liberado**: Usuário tem acesso às funcionalidades

---

## 3. Fluxo de Cadastro de Anunciante

O processo de onboarding para novos anunciantes é dividido em 7 etapas para garantir que todas as informações necessárias sejam coletadas.

![Fluxo de Cadastro de Anunciante](fluxogramas/fluxo-cadastro-anunciante.png)

### Etapas do Onboarding

| Etapa | Informações Coletadas |
|-------|----------------------|
| 1. Dados Básicos | Nome, categoria, biografia |
| 2. Características | Idade, altura, peso, características físicas |
| 3. Localização | Cidade, bairro, local próprio |
| 4. Contato | WhatsApp, Telegram |
| 5. Preços | Valor/hora, formas de pagamento |
| 6. Fotos | Upload de fotos do perfil |
| 7. Plano | Escolha e pagamento do plano |

---

## 4. Fluxo de Agendamento

O sistema de agendamento permite que usuários marquem encontros com anunciantes de forma organizada e segura.

![Fluxo de Agendamento](fluxogramas/fluxo-agendamento.png)

### Estados do Agendamento

| Status | Descrição |
|--------|-----------|
| **Pendente** | Aguardando resposta do anunciante |
| **Confirmado** | Anunciante aceitou o agendamento |
| **Cancelado** | Agendamento foi cancelado |
| **Concluído** | Encontro foi realizado |
| **Expirado** | Não houve resposta em 24h |

---

## 5. Fluxo de Pagamentos

A integração com Stripe permite pagamentos via cartão de crédito e PIX, com suporte a assinaturas recorrentes.

![Fluxo de Pagamentos](fluxogramas/fluxo-pagamentos.png)

### Planos e Preços

| Plano | Mensal | Trimestral | Anual |
|-------|--------|------------|-------|
| Básico | R$ 49 | - | - |
| Premium | R$ 99 | R$ 249 | R$ 799 |
| VIP | R$ 199 | R$ 499 | R$ 1.599 |

### Renovação Automática

O sistema de renovação automática tenta cobrar o cartão 3 vezes antes de fazer downgrade do plano. O usuário é notificado em cada tentativa.

---

## 6. Fluxo de Verificação

O processo de verificação garante que todos os perfis são reais e que os anunciantes são maiores de idade.

![Fluxo de Verificação](fluxogramas/fluxo-verificacao.png)

### Tipos de Verificação

| Badge | Requisito |
|-------|-----------|
| ✓ Documentos Verificados | RG/CPF válido e legível |
| ✓ Idade Verificada | Comprovação de maioridade |
| ✓ Fotos Reais | Selfie com documento confere |

### Motivos de Rejeição

- Documentos ilegíveis ou inválidos
- Menor de idade
- Selfie não confere com documento
- Suspeita de fraude

---

## Considerações Técnicas

### Tecnologias Utilizadas

Os fluxogramas foram criados utilizando Mermaid.js, uma ferramenta de diagramação baseada em texto que permite versionamento e fácil manutenção.

### Arquivos Fonte

Os arquivos fonte dos fluxogramas estão disponíveis em formato `.mmd` na pasta `docs/fluxogramas/`:

- `fluxo-geral-sistema.mmd`
- `fluxo-autenticacao.mmd`
- `fluxo-cadastro-anunciante.mmd`
- `fluxo-agendamento.mmd`
- `fluxo-pagamentos.mmd`
- `fluxo-verificacao.mmd`

---

*Documento gerado em Janeiro de 2026. Todos os direitos reservados.*
