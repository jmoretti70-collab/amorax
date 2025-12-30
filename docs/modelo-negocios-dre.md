# Amorax - Modelo de Negócios e DRE

**Autor:** João Moretti  
**Data:** 30 de Dezembro de 2024  
**Versão:** 1.0

---

## 1. Sumário Executivo

A **Amorax** é uma plataforma digital de classificados para acompanhantes profissionais que opera no modelo de marketplace, conectando anunciantes verificados a usuários interessados. O modelo de receita é baseado em assinaturas recorrentes (SaaS) com três níveis de planos.

### 1.1 Proposta de Valor

A Amorax se diferencia no mercado por oferecer um ambiente seguro e verificado, onde todos os anunciantes passam por processo de verificação de identidade, idade e autenticidade de fotos. Esta abordagem premium atrai tanto anunciantes que buscam credibilidade quanto usuários que valorizam segurança.

---

## 2. Análise de Mercado

### 2.1 Tamanho do Mercado

O mercado de classificados adultos no Brasil é significativo, embora informal. Estimativas indicam que existem aproximadamente 1 milhão de profissionais atuando no segmento, com faturamento anual estimado em R$ 50 bilhões.

### 2.2 Concorrência

| Concorrente | Pontos Fortes | Pontos Fracos |
|-------------|---------------|---------------|
| Splove | Interface moderna, grande base | Sem verificação rigorosa |
| TopTravesti | Nicho específico, comunidade | Design desatualizado |
| GarotaComLocal | Filtro por local, preços | Falta de verificação |
| GarotoComLocal | Segmento masculino | Interface básica |
| TravestiComLocal | Especialização | Poucos recursos |

### 2.3 Diferencial Competitivo

1. **Verificação tripla** - Documentos, idade e fotos reais
2. **Design premium** - Interface moderna e responsiva
3. **PWA mobile** - Experiência de app nativo
4. **Geolocalização** - Busca por proximidade real
5. **Três segmentos** - Mulheres, Homens e Travestis em uma única plataforma

---

## 3. Modelo de Receita

### 3.1 Estrutura de Planos

| Plano | Preço Mensal | Preço Trimestral | Preço Anual |
|-------|--------------|------------------|-------------|
| Gratuito | R$ 0 | - | - |
| Premium | R$ 99 | R$ 249 (R$ 83/mês) | R$ 799 (R$ 67/mês) |
| VIP | R$ 199 | R$ 499 (R$ 166/mês) | R$ 1.599 (R$ 133/mês) |

### 3.2 Fontes de Receita

1. **Assinaturas recorrentes** (85% da receita)
   - Planos Premium e VIP
   - Renovação automática

2. **Destaques avulsos** (10% da receita)
   - Posição de destaque por 24h: R$ 29
   - Posição de destaque por 7 dias: R$ 149

3. **Verificação expressa** (5% da receita)
   - Verificação em até 2h: R$ 49
   - Verificação padrão é gratuita (24-48h)

### 3.3 Projeção de Conversão

| Métrica | Mês 1 | Mês 6 | Mês 12 |
|---------|-------|-------|--------|
| Cadastros totais | 500 | 5.000 | 15.000 |
| Plano Gratuito | 400 (80%) | 3.500 (70%) | 9.000 (60%) |
| Plano Premium | 80 (16%) | 1.200 (24%) | 4.500 (30%) |
| Plano VIP | 20 (4%) | 300 (6%) | 1.500 (10%) |

---

## 4. DRE - Demonstração do Resultado do Exercício

### 4.1 Projeção Ano 1 (Cenário Conservador)

| Descrição | Mês 1 | Mês 6 | Mês 12 | Total Ano 1 |
|-----------|-------|-------|--------|-------------|
| **RECEITA BRUTA** | | | | |
| Assinaturas Premium | R$ 7.920 | R$ 118.800 | R$ 445.500 | R$ 2.138.400 |
| Assinaturas VIP | R$ 3.980 | R$ 59.700 | R$ 298.500 | R$ 1.343.250 |
| Destaques avulsos | R$ 1.500 | R$ 22.500 | R$ 90.000 | R$ 427.500 |
| Verificação expressa | R$ 500 | R$ 7.500 | R$ 30.000 | R$ 142.500 |
| **Total Receita Bruta** | R$ 13.900 | R$ 208.500 | R$ 864.000 | R$ 4.051.650 |
| | | | | |
| **DEDUÇÕES** | | | | |
| Impostos (Simples Nacional ~6%) | R$ 834 | R$ 12.510 | R$ 51.840 | R$ 243.099 |
| Taxa gateway pagamento (3,5%) | R$ 487 | R$ 7.298 | R$ 30.240 | R$ 141.808 |
| **Total Deduções** | R$ 1.321 | R$ 19.808 | R$ 82.080 | R$ 384.907 |
| | | | | |
| **RECEITA LÍQUIDA** | R$ 12.579 | R$ 188.693 | R$ 781.920 | R$ 3.666.743 |
| | | | | |
| **CUSTOS OPERACIONAIS** | | | | |
| Infraestrutura (servidores, CDN) | R$ 2.000 | R$ 5.000 | R$ 10.000 | R$ 66.000 |
| APIs (Google Maps, etc.) | R$ 500 | R$ 1.500 | R$ 3.000 | R$ 18.000 |
| Armazenamento S3 | R$ 200 | R$ 1.000 | R$ 3.000 | R$ 15.600 |
| **Total Custos Operacionais** | R$ 2.700 | R$ 7.500 | R$ 16.000 | R$ 99.600 |
| | | | | |
| **LUCRO BRUTO** | R$ 9.879 | R$ 181.193 | R$ 765.920 | R$ 3.567.143 |
| **Margem Bruta** | 71% | 87% | 89% | 88% |
| | | | | |
| **DESPESAS OPERACIONAIS** | | | | |
| Marketing digital | R$ 5.000 | R$ 20.000 | R$ 50.000 | R$ 300.000 |
| Equipe de moderação (2 pessoas) | R$ 6.000 | R$ 6.000 | R$ 8.000 | R$ 78.000 |
| Suporte ao cliente | R$ 2.000 | R$ 4.000 | R$ 8.000 | R$ 54.000 |
| Desenvolvimento/manutenção | R$ 5.000 | R$ 10.000 | R$ 15.000 | R$ 120.000 |
| Jurídico e contabilidade | R$ 1.500 | R$ 2.000 | R$ 3.000 | R$ 27.000 |
| Outras despesas | R$ 1.000 | R$ 2.000 | R$ 3.000 | R$ 24.000 |
| **Total Despesas Operacionais** | R$ 20.500 | R$ 44.000 | R$ 87.000 | R$ 603.000 |
| | | | | |
| **EBITDA** | -R$ 10.621 | R$ 137.193 | R$ 678.920 | R$ 2.964.143 |
| **Margem EBITDA** | -76% | 66% | 79% | 73% |
| | | | | |
| **RESULTADO LÍQUIDO** | -R$ 10.621 | R$ 137.193 | R$ 678.920 | R$ 2.964.143 |

### 4.2 Projeção Ano 2 e 3

| Métrica | Ano 1 | Ano 2 | Ano 3 |
|---------|-------|-------|-------|
| Receita Bruta | R$ 4.051.650 | R$ 9.720.000 | R$ 18.360.000 |
| Receita Líquida | R$ 3.666.743 | R$ 8.797.200 | R$ 16.615.800 |
| Custos Operacionais | R$ 99.600 | R$ 180.000 | R$ 300.000 |
| Despesas Operacionais | R$ 603.000 | R$ 1.200.000 | R$ 2.000.000 |
| EBITDA | R$ 2.964.143 | R$ 7.417.200 | R$ 14.315.800 |
| Margem EBITDA | 73% | 76% | 78% |

### 4.3 Análise de Break-even

O ponto de equilíbrio é atingido no **mês 3** de operação, quando a receita líquida supera os custos e despesas operacionais totais.

| Métrica | Valor |
|---------|-------|
| Custos fixos mensais | R$ 23.200 |
| Ticket médio ponderado | R$ 130 |
| Margem de contribuição | 85% |
| **Break-even (assinantes pagos)** | **210 assinantes** |

---

## 5. Estrutura Empresarial Recomendada

### 5.1 Tipo de Empresa

**Recomendação: LTDA (Sociedade Limitada)**

Justificativa:
- Proteção patrimonial dos sócios
- Flexibilidade na distribuição de lucros
- Facilidade de entrada/saída de sócios
- Adequada para startups em crescimento

### 5.2 Regime Tributário

**Recomendação: Simples Nacional (início) → Lucro Presumido (crescimento)**

| Faturamento Anual | Regime Recomendado | Alíquota Efetiva |
|-------------------|-------------------|------------------|
| Até R$ 180.000 | Simples Nacional | ~6% |
| R$ 180.000 - R$ 4.800.000 | Simples Nacional | ~11% |
| Acima de R$ 4.800.000 | Lucro Presumido | ~16% |

### 5.3 CNAE Sugerido

| CNAE | Descrição |
|------|-----------|
| 6319-4/00 | Portais, provedores de conteúdo e outros serviços de informação na internet |
| 6311-9/00 | Tratamento de dados, provedores de serviços de aplicação e hospedagem na internet |

### 5.4 Capital Social Inicial

**Recomendação: R$ 50.000,00**

Composição sugerida:
- Desenvolvimento da plataforma: R$ 20.000
- Marketing inicial: R$ 15.000
- Infraestrutura (6 meses): R$ 10.000
- Reserva operacional: R$ 5.000

---

## 6. Aspectos Legais e Regulatórios

### 6.1 Legislação Aplicável

| Lei/Norma | Aplicação |
|-----------|-----------|
| Marco Civil da Internet (Lei 12.965/2014) | Responsabilidade de provedores |
| LGPD (Lei 13.709/2018) | Proteção de dados pessoais |
| Código de Defesa do Consumidor | Relação com assinantes |
| ECA (Lei 8.069/1990) | Proibição de menores |

### 6.2 Medidas de Compliance

1. **Verificação de idade** - Obrigatória para todos os anunciantes
2. **Termos de uso** - Claros sobre responsabilidades
3. **Política de privacidade** - Conformidade com LGPD
4. **Moderação de conteúdo** - Equipe dedicada
5. **Canal de denúncias** - Para reportar irregularidades

### 6.3 Responsabilidade da Plataforma

A Amorax opera como **intermediária**, não sendo responsável pelo conteúdo publicado pelos anunciantes, desde que:
- Remova conteúdo ilegal quando notificada
- Não promova atividades ilegais
- Mantenha verificação de maioridade
- Coopere com autoridades quando solicitado

### 6.4 Termos de Uso - Pontos Essenciais

1. Proibição de menores de 18 anos
2. Proibição de conteúdo ilegal
3. Responsabilidade do anunciante pelo conteúdo
4. Direito de remoção de conteúdo pela plataforma
5. Política de reembolso de assinaturas
6. Jurisdição brasileira para disputas

---

## 7. Estratégia de Marketing

### 7.1 Canais de Aquisição

| Canal | Investimento Mensal | CAC Esperado |
|-------|---------------------|--------------|
| Google Ads | R$ 15.000 | R$ 50 |
| Redes Sociais | R$ 10.000 | R$ 80 |
| SEO/Conteúdo | R$ 5.000 | R$ 30 |
| Parcerias | R$ 5.000 | R$ 40 |
| Afiliados | R$ 5.000 | R$ 60 |
| **Total** | R$ 40.000 | R$ 52 (média) |

### 7.2 Métricas de Marketing

| Métrica | Meta Mês 6 | Meta Mês 12 |
|---------|------------|-------------|
| Visitantes únicos/mês | 100.000 | 500.000 |
| Taxa de cadastro | 5% | 3% |
| Taxa de conversão (free→paid) | 30% | 40% |
| Churn mensal | 8% | 5% |
| LTV médio | R$ 780 | R$ 1.040 |
| LTV/CAC | 15x | 20x |

---

## 8. Indicadores Chave (KPIs)

### 8.1 KPIs de Negócio

| KPI | Definição | Meta Ano 1 |
|-----|-----------|------------|
| MRR | Receita Recorrente Mensal | R$ 720.000 |
| ARR | Receita Recorrente Anual | R$ 8.640.000 |
| Churn Rate | Taxa de cancelamento | < 5% |
| NPS | Net Promoter Score | > 50 |
| ARPU | Receita média por usuário | R$ 130 |

### 8.2 KPIs de Produto

| KPI | Definição | Meta |
|-----|-----------|------|
| DAU/MAU | Engajamento diário | > 30% |
| Tempo médio sessão | Engajamento | > 5 min |
| Taxa de verificação | Qualidade | > 80% |
| Taxa de resposta | Efetividade | > 70% |

---

## 9. Riscos e Mitigações

### 9.1 Matriz de Riscos

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Mudança regulatória | Média | Alto | Monitoramento jurídico constante |
| Concorrência agressiva | Alta | Médio | Diferenciação por qualidade |
| Fraudes/perfis falsos | Alta | Alto | Sistema de verificação robusto |
| Problemas de reputação | Média | Alto | Moderação ativa, PR proativo |
| Falha técnica | Baixa | Alto | Redundância, backups, monitoramento |

### 9.2 Plano de Contingência

1. **Reserva financeira** - 6 meses de operação
2. **Backup de dados** - Diário, em múltiplas regiões
3. **Plano de comunicação de crise** - Definido previamente
4. **Seguro empresarial** - Responsabilidade civil

---

## 10. Roadmap de Crescimento

### 10.1 Fase 1: Lançamento (Meses 1-3)

- Lançamento da plataforma
- Aquisição dos primeiros 1.000 anunciantes
- Validação do modelo de verificação
- Ajustes baseados em feedback

### 10.2 Fase 2: Crescimento (Meses 4-12)

- Expansão para todas as capitais
- Implementação de chat em tempo real
- Programa de afiliados
- App nativo (iOS/Android)

### 10.3 Fase 3: Consolidação (Ano 2)

- Liderança de mercado
- Expansão para países vizinhos
- Novas verticais de receita
- Possível captação de investimento

---

## 11. Conclusão

O modelo de negócios da Amorax apresenta fundamentos sólidos para um negócio lucrativo e escalável. Com margens operacionais superiores a 70% após o período de maturação, a plataforma tem potencial para se tornar líder de mercado no segmento de classificados adultos verificados no Brasil.

Os principais fatores de sucesso são:
1. Diferenciação pela qualidade e verificação
2. Modelo de receita recorrente (SaaS)
3. Baixo custo marginal de operação
4. Mercado grande e fragmentado
5. Barreira de entrada pela tecnologia

O investimento inicial estimado de R$ 50.000 tem potencial de retorno (payback) em aproximadamente 4 meses de operação, com ROI projetado de 5.900% no primeiro ano.

---

**Documento elaborado por João Moretti**  
**Amorax © 2024 - Todos os direitos reservados**
