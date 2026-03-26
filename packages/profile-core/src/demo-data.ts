import { z } from 'zod'

export const rawEventTypes = [
  'search',
  'view_property',
  'start_booking',
  'complete_booking',
  'cancel_booking',
  'stay',
  'review',
  'support_ticket',
] as const

export const pipelineStageIds = [
  'source-intake',
  'schema-mapping-agent',
  'identity-resolver',
  'enrichment-agent',
  'profile-synthesizer',
  'qa-agent',
  'context-publisher',
  'reco-service-agent',
] as const

export const personaIds = [
  'business_road_warrior',
  'family_value_hunter',
  'luxury_escape_curator',
] as const

export type RawEventType = (typeof rawEventTypes)[number]
export type PipelineStageId = (typeof pipelineStageIds)[number]
export type PersonaId = (typeof personaIds)[number]
export type StageRuntimeStatus = 'pending' | 'running' | 'passed' | 'warning'
export type AgentUseCase = 'recommendation' | 'support'

export const RawEventRecordSchema = z.object({
  id: z.string(),
  personaId: z.enum(personaIds),
  source: z.string(),
  sourceLabel: z.string(),
  type: z.enum(rawEventTypes),
  timestamp: z.string(),
  sessionId: z.string(),
  channel: z.enum(['app', 'web', 'partner', 'support']),
  summary: z.string(),
  payload: z.record(z.string(), z.unknown()),
})

export const CanonicalEventSchema = z.object({
  id: z.string(),
  rawEventId: z.string(),
  personaId: z.enum(personaIds),
  eventType: z.enum(rawEventTypes),
  occurredAt: z.string(),
  destination: z.string().optional(),
  valueUsd: z.number().optional(),
  bookingWindowDays: z.number().optional(),
  partyType: z.string().optional(),
  summary: z.string(),
  normalized: z.record(z.string(), z.unknown()),
})

export const TraitEvidenceSchema = z.object({
  id: z.string(),
  label: z.string(),
  snippet: z.string(),
  sourceEventIds: z.array(z.string()).min(1),
  weight: z.number(),
  eventType: z.enum(rawEventTypes),
})

export const ProfileTraitSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.string(),
  confidence: z.number().min(0).max(1),
  freshnessAt: z.string(),
  evidenceRefs: z.array(z.string()),
  rationale: z.string(),
  trend: z.enum(['rising', 'stable', 'watch']).optional(),
})

export const ProfileChangeSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  title: z.string(),
  detail: z.string(),
})

export const UnifiedProfileSchema = z.object({
  id: z.string(),
  personaId: z.enum(personaIds),
  displayName: z.string(),
  headline: z.string(),
  overview: z.string(),
  lastUpdatedAt: z.string(),
  identity_summary: z.object({
    traveler_archetype: z.string(),
    home_market: z.string(),
    preferred_channels: z.array(z.string()),
    loyalty_posture: z.string(),
    party_signature: z.string(),
    booking_window_pattern: z.string(),
  }),
  travel_preferences: z.array(ProfileTraitSchema),
  price_sensitivity: ProfileTraitSchema,
  destination_affinity: z.array(ProfileTraitSchema),
  trip_style: z.array(ProfileTraitSchema),
  service_expectation: z.array(ProfileTraitSchema),
  risk_flags: z.array(ProfileTraitSchema),
  value_band: ProfileTraitSchema,
  recent_intents: z.array(ProfileTraitSchema),
  evidence: z.array(TraitEvidenceSchema),
  change_log: z.array(ProfileChangeSchema),
})

export const AgentContextPackSchema = z.object({
  id: z.string(),
  profileId: z.string(),
  personaId: z.enum(personaIds),
  generatedAt: z.string(),
  allowed_use_scope: z.array(z.string()),
  identity_summary: z.record(z.string(), z.string()),
  stable_preferences: z.array(z.string()),
  recent_intents: z.array(z.string()),
  risk_flags: z.array(z.string()),
  value_signals: z.array(z.string()),
  explanations: z.array(z.string()),
})

export const PipelineStageResultSchema = z.object({
  id: z.enum(pipelineStageIds),
  title: z.string(),
  agentLabel: z.string(),
  description: z.string(),
  status: z.enum(['pending', 'running', 'passed', 'warning']),
  durationMs: z.number(),
  score: z.number(),
  highlights: z.array(z.string()),
  explanation: z.string(),
  inputSample: z.unknown(),
  outputSample: z.unknown(),
})

export const EvaluationSummarySchema = z.object({
  overallScore: z.number(),
  mappingCoverage: z.number(),
  traitF1: z.number(),
  contradictionRate: z.number(),
  freshnessSla: z.string(),
  alerts: z.array(z.string()),
})

export const AgentReplaySchema = z.object({
  id: z.string(),
  personaId: z.enum(personaIds),
  type: z.enum(['recommendation', 'support']),
  title: z.string(),
  prompt: z.string(),
  response: z.string(),
  confidence: z.number(),
  citations: z.array(z.string()),
  actionItems: z.array(z.string()),
})

export const PersonaSummarySchema = z.object({
  id: z.enum(personaIds),
  displayName: z.string(),
  headline: z.string(),
  homeMarket: z.string(),
  travelArchetype: z.string(),
  spotlight: z.string(),
  rawEventCount: z.number(),
  traitCount: z.number(),
  tags: z.array(z.string()),
  highlightMetrics: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    }),
  ),
})

export const OverviewMetricSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.string(),
  delta: z.string(),
  tone: z.enum(['neutral', 'good', 'warn']),
})

export const SegmentDefinitionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  criteria: z.array(z.string()),
  estimatedReach: z.number(),
  lastSyncedAt: z.string(),
})

export const EvaluationSnapshotSchema = z.object({
  personaId: z.enum(personaIds),
  displayName: z.string(),
  overallScore: z.number(),
  mappingCoverage: z.number(),
  traitF1: z.number(),
  contradictionRate: z.number(),
  status: z.enum(['healthy', 'watch']),
})

export const JourneyStageDescriptorSchema = z.object({
  id: z.enum(pipelineStageIds),
  title: z.string(),
  agentLabel: z.string(),
})

export const DemoCatalogSchema = z.object({
  personas: z.array(PersonaSummarySchema),
  overviewMetrics: z.array(OverviewMetricSchema),
  stageGraph: z.array(JourneyStageDescriptorSchema),
  segmentDefinitions: z.array(SegmentDefinitionSchema),
  evaluationSnapshots: z.array(EvaluationSnapshotSchema),
})

export const PipelineRunSchema = z.object({
  id: z.string(),
  personaId: z.enum(personaIds),
  createdAt: z.string(),
  persona: PersonaSummarySchema,
  rawEvents: z.array(RawEventRecordSchema),
  canonicalEvents: z.array(CanonicalEventSchema),
  profile: UnifiedProfileSchema,
  contextPack: AgentContextPackSchema,
  stages: z.array(PipelineStageResultSchema),
  agentReplays: z.array(AgentReplaySchema),
  evaluation: EvaluationSummarySchema,
})

export type RawEventRecord = z.infer<typeof RawEventRecordSchema>
export type CanonicalEvent = z.infer<typeof CanonicalEventSchema>
export type TraitEvidence = z.infer<typeof TraitEvidenceSchema>
export type ProfileTrait = z.infer<typeof ProfileTraitSchema>
export type ProfileChange = z.infer<typeof ProfileChangeSchema>
export type UnifiedProfile = z.infer<typeof UnifiedProfileSchema>
export type AgentContextPack = z.infer<typeof AgentContextPackSchema>
export type PipelineStageResult = z.infer<typeof PipelineStageResultSchema>
export type EvaluationSummary = z.infer<typeof EvaluationSummarySchema>
export type AgentReplay = z.infer<typeof AgentReplaySchema>
export type PersonaSummary = z.infer<typeof PersonaSummarySchema>
export type OverviewMetric = z.infer<typeof OverviewMetricSchema>
export type SegmentDefinition = z.infer<typeof SegmentDefinitionSchema>
export type EvaluationSnapshot = z.infer<typeof EvaluationSnapshotSchema>
export type JourneyStageDescriptor = z.infer<typeof JourneyStageDescriptorSchema>
export type DemoCatalog = z.infer<typeof DemoCatalogSchema>
export type PipelineRun = z.infer<typeof PipelineRunSchema>

type PersonaBlueprint = {
  summary: PersonaSummary
  rawEvents: RawEventRecord[]
  canonicalEvents: CanonicalEvent[]
  profile: UnifiedProfile
  contextPack: AgentContextPack
  evaluation: EvaluationSummary
  agentTemplates: Record<
    AgentUseCase,
    Omit<AgentReplay, 'id' | 'personaId' | 'prompt'>
  >
}

const stageGraph: JourneyStageDescriptor[] = [
  { id: 'source-intake', title: 'Source Intake', agentLabel: 'Connector Runtime' },
  { id: 'schema-mapping-agent', title: 'Schema Mapping Agent', agentLabel: 'Mapping Agent' },
  { id: 'identity-resolver', title: 'Identity Resolver', agentLabel: 'Resolution Engine' },
  { id: 'enrichment-agent', title: 'Enrichment Agent', agentLabel: 'Signal Extractor' },
  { id: 'profile-synthesizer', title: 'Profile Synthesizer', agentLabel: 'Profile Composer' },
  { id: 'qa-agent', title: 'QA Agent', agentLabel: 'Quality Gate' },
  { id: 'context-publisher', title: 'Context Publisher', agentLabel: 'Context Pack Builder' },
  { id: 'reco-service-agent', title: 'Reco/Service Agent', agentLabel: 'Downstream Consumers' },
]

function createEvidence(
  id: string,
  label: string,
  snippet: string,
  eventType: RawEventType,
  sourceEventIds: string[],
  weight: number,
): TraitEvidence {
  return { id, label, snippet, eventType, sourceEventIds, weight }
}

function createTrait(
  id: string,
  label: string,
  value: string,
  confidence: number,
  freshnessAt: string,
  evidenceRefs: string[],
  rationale: string,
  trend?: 'rising' | 'stable' | 'watch',
): ProfileTrait {
  return { id, label, value, confidence, freshnessAt, evidenceRefs, rationale, trend }
}

const personaBlueprints: Record<PersonaId, PersonaBlueprint> = {
  business_road_warrior: {
    summary: {
      id: 'business_road_warrior',
      displayName: '林致远',
      headline: '高频商旅用户，优先购买稳定性和会场半径',
      homeMarket: '上海，中国',
      travelArchetype: '高频商旅',
      spotlight: '对位置、发票和深夜入住保障高度敏感',
      rawEventCount: 8,
      traitCount: 12,
      tags: ['商旅', '高价值', '低容错'],
      highlightMetrics: [
        { label: '12 个月 GMV', value: '$14.2k' },
        { label: '平均提前期', value: '6 天' },
        { label: '客服优先级', value: 'P1' },
      ],
    },
    rawEvents: [
      {
        id: 'evt_biz_01',
        personaId: 'business_road_warrior',
        source: 'booking_partner_feed',
        sourceLabel: 'Booking.com partner export',
        type: 'search',
        timestamp: '2026-03-14T08:15:00Z',
        sessionId: 'sess_biz_sg_01',
        channel: 'web',
        summary: '搜索新加坡滨海湾 3 晚商务酒店，筛选含早餐与可开发票。',
        payload: {
          destination: 'Singapore Marina Bay',
          checkIn: '2026-03-20',
          nights: 3,
          travelers: 1,
          filters: ['breakfast', 'invoice_ready', '8.5+ review'],
        },
      },
      {
        id: 'evt_biz_02',
        personaId: 'business_road_warrior',
        source: 'trip_inventory_stream',
        sourceLabel: 'Trip.com browse stream',
        type: 'view_property',
        timestamp: '2026-03-14T08:19:00Z',
        sessionId: 'sess_biz_sg_01',
        channel: 'app',
        summary: '查看会展中心步行 8 分钟内的两家酒店，重点比较 Wi-Fi 和发票说明。',
        payload: {
          propertyName: 'Harbour Summit Hotel',
          destination: 'Singapore Marina Bay',
          distanceToVenueKm: 0.7,
          nightlyRateUsd: 318,
          highlights: ['late check-in', 'fast wifi', 'invoice support'],
        },
      },
      {
        id: 'evt_biz_03',
        personaId: 'business_road_warrior',
        source: 'booking_partner_feed',
        sourceLabel: 'Booking.com booking state',
        type: 'start_booking',
        timestamp: '2026-03-14T08:31:00Z',
        sessionId: 'sess_biz_sg_01',
        channel: 'web',
        summary: '开始预订 Harbour Summit Hotel 商务大床房。',
        payload: {
          propertyName: 'Harbour Summit Hotel',
          destination: 'Singapore Marina Bay',
          roomType: 'Business King',
          nightlyRateUsd: 318,
        },
      },
      {
        id: 'evt_biz_04',
        personaId: 'business_road_warrior',
        source: 'booking_partner_feed',
        sourceLabel: 'Booking.com booking state',
        type: 'complete_booking',
        timestamp: '2026-03-14T08:36:00Z',
        sessionId: 'sess_biz_sg_01',
        channel: 'web',
        summary: '完成预订，总价 954 美元，附加机场快线与延迟退房。',
        payload: {
          propertyName: 'Harbour Summit Hotel',
          destination: 'Singapore Marina Bay',
          totalValueUsd: 954,
          addOns: ['airport express', 'late checkout'],
          invoiceRequested: true,
        },
      },
      {
        id: 'evt_biz_05',
        personaId: 'business_road_warrior',
        source: 'trip_post_stay',
        sourceLabel: 'Trip.com stay ledger',
        type: 'stay',
        timestamp: '2026-03-23T01:00:00Z',
        sessionId: 'sess_biz_sg_01',
        channel: 'partner',
        summary: '完成入住，深夜 00:40 到店，使用快速入住通道。',
        payload: {
          propertyName: 'Harbour Summit Hotel',
          lateArrival: true,
          checkInTime: '00:40',
          amenitiesUsed: ['express check-in', 'lounge'],
        },
      },
      {
        id: 'evt_biz_06',
        personaId: 'business_road_warrior',
        source: 'trip_reviews',
        sourceLabel: 'Trip.com review feed',
        type: 'review',
        timestamp: '2026-03-24T10:00:00Z',
        sessionId: 'sess_biz_sg_01',
        channel: 'app',
        summary: '给出 4.8 分好评，称赞会场通勤效率和网络稳定，但提醒发票抬头最好预填。',
        payload: {
          rating: 4.8,
          text: '位置和网速都很好，凌晨入住也顺畅。建议把发票抬头预填做得更明显。',
        },
      },
      {
        id: 'evt_biz_07',
        personaId: 'business_road_warrior',
        source: 'support_hub',
        sourceLabel: 'Support CRM',
        type: 'support_ticket',
        timestamp: '2026-03-25T03:20:00Z',
        sessionId: 'sess_biz_invoice_01',
        channel: 'support',
        summary: '提交客服工单，要求加急补开发票 PDF，用于报销。',
        payload: {
          ticketTopic: 'invoice',
          urgency: 'high',
          resolutionTargetMins: 30,
          transcript:
            '我今天要报销，麻烦尽快发正式 PDF 发票，抬头需要公司名称和税号完整。',
        },
      },
      {
        id: 'evt_biz_08',
        personaId: 'business_road_warrior',
        source: 'booking_partner_feed',
        sourceLabel: 'Booking.com partner export',
        type: 'search',
        timestamp: '2026-03-25T22:10:00Z',
        sessionId: 'sess_biz_tokyo_01',
        channel: 'app',
        summary: '再次搜索东京品川 2 晚商务酒店，筛选靠近车站和可取消。',
        payload: {
          destination: 'Tokyo Shinagawa',
          checkIn: '2026-04-02',
          nights: 2,
          travelers: 1,
          filters: ['near station', 'free cancellation', 'invoice_ready'],
        },
      },
    ],
    canonicalEvents: [
      {
        id: 'cn_biz_01',
        rawEventId: 'evt_biz_01',
        personaId: 'business_road_warrior',
        eventType: 'search',
        occurredAt: '2026-03-14T08:15:00Z',
        destination: 'Singapore Marina Bay',
        bookingWindowDays: 6,
        partyType: 'solo-business',
        summary: '商务短住搜索，偏向高评分含早餐房源。',
        normalized: {
          stayLengthNights: 3,
          travelerCount: 1,
          filters: ['breakfast', 'invoice_ready', 'high_review_score'],
        },
      },
      {
        id: 'cn_biz_02',
        rawEventId: 'evt_biz_02',
        personaId: 'business_road_warrior',
        eventType: 'view_property',
        occurredAt: '2026-03-14T08:19:00Z',
        destination: 'Singapore Marina Bay',
        valueUsd: 318,
        summary: '浏览会展半径 1km 内房源并核对发票说明。',
        normalized: {
          propertyName: 'Harbour Summit Hotel',
          distanceToVenueKm: 0.7,
          wifiPriority: true,
          invoiceReady: true,
        },
      },
      {
        id: 'cn_biz_03',
        rawEventId: 'evt_biz_03',
        personaId: 'business_road_warrior',
        eventType: 'start_booking',
        occurredAt: '2026-03-14T08:31:00Z',
        destination: 'Singapore Marina Bay',
        valueUsd: 318,
        partyType: 'solo-business',
        summary: '进入预订页，选择 Business King。',
        normalized: {
          roomType: 'Business King',
          invoiceRequested: true,
        },
      },
      {
        id: 'cn_biz_04',
        rawEventId: 'evt_biz_04',
        personaId: 'business_road_warrior',
        eventType: 'complete_booking',
        occurredAt: '2026-03-14T08:36:00Z',
        destination: 'Singapore Marina Bay',
        valueUsd: 954,
        bookingWindowDays: 6,
        partyType: 'solo-business',
        summary: '完成 3 晚商务酒店订单，附带延迟退房。',
        normalized: {
          addOns: ['airport express', 'late checkout'],
          nights: 3,
          invoiceRequested: true,
        },
      },
      {
        id: 'cn_biz_05',
        rawEventId: 'evt_biz_05',
        personaId: 'business_road_warrior',
        eventType: 'stay',
        occurredAt: '2026-03-23T01:00:00Z',
        destination: 'Singapore Marina Bay',
        summary: '深夜到店并使用快速入住通道。',
        normalized: {
          lateArrival: true,
          checkInTime: '00:40',
        },
      },
      {
        id: 'cn_biz_06',
        rawEventId: 'evt_biz_06',
        personaId: 'business_road_warrior',
        eventType: 'review',
        occurredAt: '2026-03-24T10:00:00Z',
        destination: 'Singapore Marina Bay',
        summary: '评论强调会场效率与发票抬头流程。',
        normalized: {
          rating: 4.8,
          topics: ['location', 'wifi', 'invoice'],
        },
      },
      {
        id: 'cn_biz_07',
        rawEventId: 'evt_biz_07',
        personaId: 'business_road_warrior',
        eventType: 'support_ticket',
        occurredAt: '2026-03-25T03:20:00Z',
        summary: '报销相关工单，高优先级。',
        normalized: {
          ticketTopic: 'invoice',
          urgency: 'high',
          responseSlaMins: 30,
        },
      },
      {
        id: 'cn_biz_08',
        rawEventId: 'evt_biz_08',
        personaId: 'business_road_warrior',
        eventType: 'search',
        occurredAt: '2026-03-25T22:10:00Z',
        destination: 'Tokyo Shinagawa',
        bookingWindowDays: 8,
        partyType: 'solo-business',
        summary: '继续搜索东京车站周边商务短住。',
        normalized: {
          stayLengthNights: 2,
          travelerCount: 1,
          filters: ['near station', 'free cancellation', 'invoice_ready'],
        },
      },
    ],
    profile: {
      id: 'profile_business_road_warrior',
      personaId: 'business_road_warrior',
      displayName: '林致远',
      headline: '高频商旅用户，优先购买稳定性和会场半径',
      overview:
        '最近 30 天持续表现出高频短住商旅行为，对位置效率、发票链路和深夜入住保障的需求最强。',
      lastUpdatedAt: '2026-03-26T09:00:00Z',
      identity_summary: {
        traveler_archetype: '高频商旅',
        home_market: '上海，中国',
        preferred_channels: ['Booking partner web', 'Trip app'],
        loyalty_posture: '无明显平台忠诚，但对效率型服务表现忠诚',
        party_signature: '单人出行',
        booking_window_pattern: '平均提前 6-8 天',
      },
      travel_preferences: [
        createTrait(
          'biz_pref_1',
          '位置偏好',
          '会场 / 高铁 / 机场 1 公里内',
          0.95,
          '2026-03-25T22:10:00Z',
          ['ev_biz_loc_1', 'ev_biz_loc_2'],
          '连续搜索和浏览均围绕会展与车站半径展开。',
          'stable',
        ),
        createTrait(
          'biz_pref_2',
          '设施偏好',
          '稳定 Wi-Fi、快速入住、早餐可用',
          0.91,
          '2026-03-24T10:00:00Z',
          ['ev_biz_wifi_1', 'ev_biz_wifi_2'],
          '评论和浏览行为均强调网速与深夜到店效率。',
          'stable',
        ),
      ],
      price_sensitivity: createTrait(
        'biz_price_1',
        'Price posture',
        '效率优先，可为稳定性支付 12-18% 溢价',
        0.88,
        '2026-03-14T08:36:00Z',
        ['ev_biz_price_1'],
        '在商务场景中未出现显著降价试探，成交价格高于同区域中位数。',
        'stable',
      ),
      destination_affinity: [
        createTrait(
          'biz_dest_1',
          '目的地偏好',
          '新加坡滨海湾',
          0.93,
          '2026-03-24T10:00:00Z',
          ['ev_biz_dest_1'],
          '近期完成入住并留下正向评论。',
          'rising',
        ),
        createTrait(
          'biz_dest_2',
          '目的地偏好',
          '东京品川',
          0.78,
          '2026-03-25T22:10:00Z',
          ['ev_biz_dest_2'],
          '新的高意图搜索落在商务交通节点周边。',
          'rising',
        ),
      ],
      trip_style: [
        createTrait(
          'biz_style_1',
          '住宿节奏',
          '2-4 晚短住',
          0.9,
          '2026-03-25T22:10:00Z',
          ['ev_biz_style_1'],
          '所有已知订单和搜索都在短住窗口内。',
          'stable',
        ),
        createTrait(
          'biz_style_2',
          '出行动机',
          '会议 / 客户拜访驱动',
          0.86,
          '2026-03-24T10:00:00Z',
          ['ev_biz_style_2'],
          '目的地与位置选择高度贴近商务设施。',
          'stable',
        ),
      ],
      service_expectation: [
        createTrait(
          'biz_srv_1',
          '客服期待',
          '发票和报销问题需 30 分钟内解决',
          0.94,
          '2026-03-25T03:20:00Z',
          ['ev_biz_srv_1'],
          '主动提交高优工单，明确时间压力。',
          'watch',
        ),
        createTrait(
          'biz_srv_2',
          '服务风格',
          '偏好零摩擦、无需重复确认',
          0.83,
          '2026-03-24T10:00:00Z',
          ['ev_biz_srv_2'],
          '评价信息聚焦流程效率而非情绪陪伴。',
          'stable',
        ),
      ],
      risk_flags: [
        createTrait(
          'biz_risk_1',
          '服务风险',
          '发票流程出错会快速升级投诉',
          0.82,
          '2026-03-25T03:20:00Z',
          ['ev_biz_risk_1'],
          '工单语气和时效要求说明其对报销链路容错率低。',
          'watch',
        ),
      ],
      value_band: createTrait(
        'biz_value_1',
        'Value band',
        '高价值 / 年化 GMV 14.2k 美元',
        0.96,
        '2026-03-14T08:36:00Z',
        ['ev_biz_value_1'],
        '客单价高、出行频次高、投诉风险低于整体高价值客群平均线。',
        'stable',
      ),
      recent_intents: [
        createTrait(
          'biz_intent_1',
          '当前意图',
          '下周东京会议行程，优先品川车站周边',
          0.89,
          '2026-03-25T22:10:00Z',
          ['ev_biz_intent_1'],
          '最新搜索强信号指向东京短住商旅。',
          'rising',
        ),
      ],
      evidence: [
        createEvidence(
          'ev_biz_loc_1',
          '会展半径搜索',
          '搜索与浏览都限定在会场步行半径和车站半径。',
          'search',
          ['evt_biz_01', 'evt_biz_08'],
          0.94,
        ),
        createEvidence(
          'ev_biz_loc_2',
          '浏览关注位置',
          '查看房源时重点比较与会展中心距离。',
          'view_property',
          ['evt_biz_02'],
          0.88,
        ),
        createEvidence(
          'ev_biz_wifi_1',
          '评论强调网速',
          '“位置和网速都很好，凌晨入住也顺畅。”',
          'review',
          ['evt_biz_06'],
          0.86,
        ),
        createEvidence(
          'ev_biz_wifi_2',
          '筛选早餐与发票',
          '初次搜索就带上早餐与发票相关筛选。',
          'search',
          ['evt_biz_01'],
          0.78,
        ),
        createEvidence(
          'ev_biz_price_1',
          '成交溢价',
          '选择高于区域中位价的商务房并额外购买延迟退房。',
          'complete_booking',
          ['evt_biz_04'],
          0.81,
        ),
        createEvidence(
          'ev_biz_dest_1',
          '新加坡复购潜力',
          '完成住宿并给出高分评论。',
          'stay',
          ['evt_biz_05', 'evt_biz_06'],
          0.84,
        ),
        createEvidence(
          'ev_biz_dest_2',
          '东京新意图',
          '最新一次深夜搜索转向东京品川。',
          'search',
          ['evt_biz_08'],
          0.8,
        ),
        createEvidence(
          'ev_biz_style_1',
          '短住稳定',
          '全部事件都聚焦在 2-4 晚窗口。',
          'complete_booking',
          ['evt_biz_04', 'evt_biz_08'],
          0.87,
        ),
        createEvidence(
          'ev_biz_style_2',
          '商务设施依赖',
          '位置偏好明显围绕交通和会展设施。',
          'view_property',
          ['evt_biz_02'],
          0.77,
        ),
        createEvidence(
          'ev_biz_srv_1',
          '报销高压场景',
          '要求 30 分钟内补开发票 PDF。',
          'support_ticket',
          ['evt_biz_07'],
          0.95,
        ),
        createEvidence(
          'ev_biz_srv_2',
          '零摩擦需求',
          '评论建议平台把发票抬头预填做得更明显。',
          'review',
          ['evt_biz_06'],
          0.73,
        ),
        createEvidence(
          'ev_biz_risk_1',
          '低容错投诉点',
          '工单清楚表达“今天要报销”。',
          'support_ticket',
          ['evt_biz_07'],
          0.88,
        ),
        createEvidence(
          'ev_biz_value_1',
          '高价值订单',
          '单次订单总价 954 美元，附加增值服务。',
          'complete_booking',
          ['evt_biz_04'],
          0.9,
        ),
        createEvidence(
          'ev_biz_intent_1',
          '最新目的地意图',
          '搜索东京品川 2 晚，附带 free cancellation。',
          'search',
          ['evt_biz_08'],
          0.86,
        ),
      ],
      change_log: [
        {
          id: 'biz_change_1',
          timestamp: '2026-03-25T22:12:00Z',
          title: '新增东京商务意图',
          detail: '最新搜索把目的地偏好从单一新加坡扩展到东京品川。',
        },
        {
          id: 'biz_change_2',
          timestamp: '2026-03-25T03:30:00Z',
          title: '服务优先级提升',
          detail: '发票工单触发客服优先级从 P2 上调到 P1。',
        },
      ],
    },
    contextPack: {
      id: 'ctx_business_road_warrior',
      profileId: 'profile_business_road_warrior',
      personaId: 'business_road_warrior',
      generatedAt: '2026-03-26T09:05:00Z',
      allowed_use_scope: ['recommendation', 'service-assist', 'ranking'],
      identity_summary: {
        traveler_archetype: '高频商旅',
        home_market: '上海，中国',
        preferred_channels: 'Booking partner web / Trip app',
        loyalty_posture: '服务效率驱动',
      },
      stable_preferences: [
        '优先会场、高铁、机场 1 公里内房源',
        '愿意为快速入住和稳定 Wi-Fi 溢价',
        '需要可开发票和零摩擦报销链路',
      ],
      recent_intents: ['计划 4 月初东京品川两晚商务入住'],
      risk_flags: ['若发票或深夜入住保障出错，升级投诉概率高'],
      value_signals: ['年化 GMV 14.2k 美元', '短住频次高', '增值服务购买意愿高'],
      explanations: [
        '近两次搜索都带有商务交通枢纽偏好。',
        '最近工单表明其对发票时效极度敏感。',
      ],
    },
    evaluation: {
      overallScore: 96,
      mappingCoverage: 98,
      traitF1: 0.92,
      contradictionRate: 0.01,
      freshnessSla: '< 6h',
      alerts: ['发票敏感 trait 建议保留人工解释文本。'],
    },
    agentTemplates: {
      recommendation: {
        type: 'recommendation',
        title: '推荐 Agent 输出',
        response:
          '建议优先返回东京品川站与羽田快线 20 分钟内的高评分商务酒店，突出“发票友好”“深夜入住保障”和“稳定 Wi-Fi”这三个卖点。',
        confidence: 0.92,
        citations: ['位置偏好', '发票工单', '东京最新搜索意图'],
        actionItems: [
          '首屏推荐 2 家商务酒店和 1 家带行政酒廊房源',
          '推荐文案中明确写出开票与 late check-in 保障',
        ],
      },
      support: {
        type: 'support',
        title: '服务 Agent 输出',
        response:
          '该用户为高价值商旅客户，当前诉求是发票补开。建议直接走加急模板，避免重复收集信息，并在回复首句确认报销时间压力。',
        confidence: 0.95,
        citations: ['高价值分层', '高优工单 transcript', '零摩擦服务偏好'],
        actionItems: [
          '直接调用发票补开发送流程',
          '承诺具体完成时间而不是“尽快处理”',
        ],
      },
    },
  },
  family_value_hunter: {
    summary: {
      id: 'family_value_hunter',
      displayName: '周雨彤',
      headline: '价格敏感的家庭出游用户，重视早餐、儿童设施和可取消',
      homeMarket: '杭州，中国',
      travelArchetype: '家庭价值型',
      spotlight: '会对促销、儿童早餐和家庭房组合高度响应',
      rawEventCount: 8,
      traitCount: 13,
      tags: ['亲子', '价格敏感', '高取消弹性'],
      highlightMetrics: [
        { label: '价格弹性', value: '高' },
        { label: '家庭人数', value: '2 大 1 小' },
        { label: '优惠券响应', value: '+27%' },
      ],
    },
    rawEvents: [
      {
        id: 'evt_fam_01',
        personaId: 'family_value_hunter',
        source: 'trip_marketing_feed',
        sourceLabel: 'Trip.com app feed',
        type: 'search',
        timestamp: '2026-03-08T02:10:00Z',
        sessionId: 'sess_fam_jp_01',
        channel: 'app',
        summary: '搜索大阪环球影城周边 4 晚家庭房，筛选免费早餐和儿童入住政策。',
        payload: {
          destination: 'Osaka Universal Studios',
          checkIn: '2026-04-03',
          nights: 4,
          travelers: 3,
          filters: ['family room', 'kids breakfast', 'free cancellation'],
        },
      },
      {
        id: 'evt_fam_02',
        personaId: 'family_value_hunter',
        source: 'trip_marketing_feed',
        sourceLabel: 'Trip.com browse stream',
        type: 'view_property',
        timestamp: '2026-03-08T02:18:00Z',
        sessionId: 'sess_fam_jp_01',
        channel: 'app',
        summary: '反复比较两家亲子酒店的家庭房面积、早餐和接驳班车。',
        payload: {
          propertyName: 'Smile Family Resort Osaka',
          destination: 'Osaka Universal Studios',
          nightlyRateUsd: 182,
          highlights: ['kids breakfast', 'shuttle bus', 'family suite'],
        },
      },
      {
        id: 'evt_fam_03',
        personaId: 'family_value_hunter',
        source: 'promo_center',
        sourceLabel: 'Promotion service',
        type: 'start_booking',
        timestamp: '2026-03-08T02:31:00Z',
        sessionId: 'sess_fam_jp_01',
        channel: 'app',
        summary: '领券后进入预订页，套用家庭房 9 折促销。',
        payload: {
          propertyName: 'Smile Family Resort Osaka',
          destination: 'Osaka Universal Studios',
          couponCode: 'FAMILY10',
          nightlyRateUsd: 163.8,
        },
      },
      {
        id: 'evt_fam_04',
        personaId: 'family_value_hunter',
        source: 'booking_partner_feed',
        sourceLabel: 'Booking.com booking state',
        type: 'cancel_booking',
        timestamp: '2026-03-10T06:45:00Z',
        sessionId: 'sess_fam_jp_01',
        channel: 'web',
        summary: '因发现更低价格的同类房源，取消首单。',
        payload: {
          propertyName: 'Smile Family Resort Osaka',
          cancellationReason: 'found better price',
          refundWindowHours: 6,
        },
      },
      {
        id: 'evt_fam_05',
        personaId: 'family_value_hunter',
        source: 'booking_partner_feed',
        sourceLabel: 'Booking.com booking state',
        type: 'complete_booking',
        timestamp: '2026-03-10T07:12:00Z',
        sessionId: 'sess_fam_jp_02',
        channel: 'web',
        summary: '改订京都亲子酒店，4 晚总价 648 美元，含早餐和儿童乐园通票。',
        payload: {
          propertyName: 'Kyoto Garden Family Hotel',
          destination: 'Kyoto Higashiyama',
          totalValueUsd: 648,
          addOns: ['kids breakfast', 'play zone ticket'],
          travelers: '2 adults + 1 kid',
        },
      },
      {
        id: 'evt_fam_06',
        personaId: 'family_value_hunter',
        source: 'trip_post_stay',
        sourceLabel: 'Trip.com stay ledger',
        type: 'stay',
        timestamp: '2026-04-08T00:30:00Z',
        sessionId: 'sess_fam_jp_02',
        channel: 'partner',
        summary: '完成入住，重点使用儿童早餐和酒店接驳。',
        payload: {
          propertyName: 'Kyoto Garden Family Hotel',
          amenitiesUsed: ['kids breakfast', 'shuttle bus', 'play zone'],
        },
      },
      {
        id: 'evt_fam_07',
        personaId: 'family_value_hunter',
        source: 'trip_reviews',
        sourceLabel: 'Trip.com review feed',
        type: 'review',
        timestamp: '2026-04-09T13:00:00Z',
        sessionId: 'sess_fam_jp_02',
        channel: 'app',
        summary: '评论夸奖孩子早餐和接驳很省心，但提到房间若能带洗衣机会更好。',
        payload: {
          rating: 4.6,
          text: '孩子很喜欢早餐和游乐区，接驳车很省心。如果房间内有洗衣机会更完美。',
        },
      },
      {
        id: 'evt_fam_08',
        personaId: 'family_value_hunter',
        source: 'support_hub',
        sourceLabel: 'Support CRM',
        type: 'support_ticket',
        timestamp: '2026-04-09T14:10:00Z',
        sessionId: 'sess_fam_support_01',
        channel: 'support',
        summary: '咨询下次出游是否有儿童免费早餐和连通房推荐。',
        payload: {
          ticketTopic: 'family planning',
          urgency: 'medium',
          transcript:
            '下个月还想带孩子去冲绳，想找儿童早餐友好、最好有连通房或者洗衣机的酒店。',
        },
      },
    ],
    canonicalEvents: [
      {
        id: 'cn_fam_01',
        rawEventId: 'evt_fam_01',
        personaId: 'family_value_hunter',
        eventType: 'search',
        occurredAt: '2026-03-08T02:10:00Z',
        destination: 'Osaka Universal Studios',
        bookingWindowDays: 26,
        partyType: 'family-with-child',
        summary: '亲子家庭房搜索，重视早餐和可取消。',
        normalized: {
          stayLengthNights: 4,
          travelerCount: 3,
          filters: ['family_room', 'kids_breakfast', 'free_cancellation'],
        },
      },
      {
        id: 'cn_fam_02',
        rawEventId: 'evt_fam_02',
        personaId: 'family_value_hunter',
        eventType: 'view_property',
        occurredAt: '2026-03-08T02:18:00Z',
        destination: 'Osaka Universal Studios',
        valueUsd: 182,
        summary: '比对亲子设施与家庭房面积。',
        normalized: {
          propertyName: 'Smile Family Resort Osaka',
          familySuite: true,
          shuttleBus: true,
        },
      },
      {
        id: 'cn_fam_03',
        rawEventId: 'evt_fam_03',
        personaId: 'family_value_hunter',
        eventType: 'start_booking',
        occurredAt: '2026-03-08T02:31:00Z',
        destination: 'Osaka Universal Studios',
        valueUsd: 163.8,
        summary: '领券后启动预订。',
        normalized: {
          couponCode: 'FAMILY10',
          discountApplied: true,
        },
      },
      {
        id: 'cn_fam_04',
        rawEventId: 'evt_fam_04',
        personaId: 'family_value_hunter',
        eventType: 'cancel_booking',
        occurredAt: '2026-03-10T06:45:00Z',
        summary: '因更低价格取消。',
        normalized: {
          cancellationReason: 'found_better_price',
        },
      },
      {
        id: 'cn_fam_05',
        rawEventId: 'evt_fam_05',
        personaId: 'family_value_hunter',
        eventType: 'complete_booking',
        occurredAt: '2026-03-10T07:12:00Z',
        destination: 'Kyoto Higashiyama',
        valueUsd: 648,
        bookingWindowDays: 24,
        partyType: 'family-with-child',
        summary: '完成 4 晚亲子入住订单。',
        normalized: {
          addOns: ['kids breakfast', 'play zone ticket'],
          familyFriendly: true,
        },
      },
      {
        id: 'cn_fam_06',
        rawEventId: 'evt_fam_06',
        personaId: 'family_value_hunter',
        eventType: 'stay',
        occurredAt: '2026-04-08T00:30:00Z',
        destination: 'Kyoto Higashiyama',
        summary: '使用儿童早餐、接驳与游乐区。',
        normalized: {
          amenityUsage: ['kids breakfast', 'shuttle bus', 'play zone'],
        },
      },
      {
        id: 'cn_fam_07',
        rawEventId: 'evt_fam_07',
        personaId: 'family_value_hunter',
        eventType: 'review',
        occurredAt: '2026-04-09T13:00:00Z',
        destination: 'Kyoto Higashiyama',
        summary: '评论强调儿童早餐、接驳和洗衣机诉求。',
        normalized: {
          rating: 4.6,
          topics: ['kids breakfast', 'shuttle bus', 'washing machine'],
        },
      },
      {
        id: 'cn_fam_08',
        rawEventId: 'evt_fam_08',
        personaId: 'family_value_hunter',
        eventType: 'support_ticket',
        occurredAt: '2026-04-09T14:10:00Z',
        summary: '为下次冲绳出游咨询儿童早餐与连通房。',
        normalized: {
          ticketTopic: 'family planning',
          nextDestination: 'Okinawa',
        },
      },
    ],
    profile: {
      id: 'profile_family_value_hunter',
      personaId: 'family_value_hunter',
      displayName: '周雨彤',
      headline: '价格敏感的家庭出游用户，重视早餐、儿童设施和可取消',
      overview:
        '这类用户会主动对比优惠和家庭设施，只要儿童价值点明确，就愿意完成多晚亲子订单。',
      lastUpdatedAt: '2026-04-09T15:00:00Z',
      identity_summary: {
        traveler_archetype: '家庭价值型',
        home_market: '杭州，中国',
        preferred_channels: ['Trip app', 'Booking web'],
        loyalty_posture: '对优惠和家庭权益敏感，平台忠诚度中等',
        party_signature: '2 大 1 小',
        booking_window_pattern: '平均提前 3-4 周',
      },
      travel_preferences: [
        createTrait(
          'fam_pref_1',
          '家庭设施偏好',
          '儿童早餐、接驳、游乐区、连通房',
          0.95,
          '2026-04-09T14:10:00Z',
          ['ev_fam_pref_1', 'ev_fam_pref_2'],
          '搜索、入住和客服咨询都围绕亲子设施。',
          'stable',
        ),
        createTrait(
          'fam_pref_2',
          '居住条件偏好',
          '偏好可洗衣或房内洗烘设施',
          0.76,
          '2026-04-09T13:00:00Z',
          ['ev_fam_pref_3'],
          '评论中明确提出洗衣机诉求。',
          'rising',
        ),
      ],
      price_sensitivity: createTrait(
        'fam_price_1',
        'Price posture',
        '高度价格敏感，愿因 8-12% 差价取消并重订',
        0.94,
        '2026-03-10T06:45:00Z',
        ['ev_fam_price_1'],
        '存在明确“发现更低价格后取消”的行为。',
        'stable',
      ),
      destination_affinity: [
        createTrait(
          'fam_dest_1',
          '目的地偏好',
          '京都 / 大阪亲子景点圈',
          0.89,
          '2026-04-09T13:00:00Z',
          ['ev_fam_dest_1'],
          '完成入住与正向评价均落在京阪亲子景点附近。',
          'stable',
        ),
        createTrait(
          'fam_dest_2',
          '目的地偏好',
          '冲绳家庭度假',
          0.72,
          '2026-04-09T14:10:00Z',
          ['ev_fam_dest_2'],
          '客服咨询透露下一个高意图目的地。',
          'rising',
        ),
      ],
      trip_style: [
        createTrait(
          'fam_style_1',
          '住宿节奏',
          '4 晚左右中长住',
          0.87,
          '2026-03-10T07:12:00Z',
          ['ev_fam_style_1'],
          '订单与搜索均为多晚亲子假期。',
          'stable',
        ),
        createTrait(
          'fam_style_2',
          '出行动机',
          '亲子假期 / 景点导向',
          0.91,
          '2026-04-09T14:10:00Z',
          ['ev_fam_style_2'],
          '行程围绕景点接驳和儿童体验展开。',
          'stable',
        ),
      ],
      service_expectation: [
        createTrait(
          'fam_srv_1',
          '沟通偏好',
          '希望客服直接给出适合儿童早餐和连通房的组合建议',
          0.84,
          '2026-04-09T14:10:00Z',
          ['ev_fam_srv_1'],
          '客服咨询表达出对“省心搭配建议”的期待。',
          'stable',
        ),
      ],
      risk_flags: [
        createTrait(
          'fam_risk_1',
          '交易风险',
          '价格波动或活动不透明时存在改订 / 取消',
          0.9,
          '2026-03-10T06:45:00Z',
          ['ev_fam_risk_1'],
          '取消行为已被真实观测。',
          'watch',
        ),
      ],
      value_band: createTrait(
        'fam_value_1',
        'Value band',
        '中高潜力 / 对权益刺激反应明显',
        0.8,
        '2026-03-10T07:12:00Z',
        ['ev_fam_value_1'],
        '订单规模适中，但对复购权益和活动券的反应度高。',
        'rising',
      ),
      recent_intents: [
        createTrait(
          'fam_intent_1',
          '当前意图',
          '下个月冲绳家庭度假，希望有儿童早餐与连通房',
          0.88,
          '2026-04-09T14:10:00Z',
          ['ev_fam_intent_1'],
          '客服咨询指向明确的下次出游要求。',
          'rising',
        ),
      ],
      evidence: [
        createEvidence(
          'ev_fam_pref_1',
          '亲子筛选',
          '搜索时就筛选儿童早餐和免费取消。',
          'search',
          ['evt_fam_01'],
          0.86,
        ),
        createEvidence(
          'ev_fam_pref_2',
          '入住实际使用',
          '入住后重点使用儿童早餐、接驳和游乐区。',
          'stay',
          ['evt_fam_06'],
          0.91,
        ),
        createEvidence(
          'ev_fam_pref_3',
          '洗衣机诉求',
          '评论中直接提到“如果房间内有洗衣机会更完美”。',
          'review',
          ['evt_fam_07'],
          0.72,
        ),
        createEvidence(
          'ev_fam_price_1',
          '因价格取消',
          '发现更低价格后取消首单。',
          'cancel_booking',
          ['evt_fam_04'],
          0.96,
        ),
        createEvidence(
          'ev_fam_dest_1',
          '京阪家庭游',
          '最终完成京都亲子酒店订单。',
          'complete_booking',
          ['evt_fam_05'],
          0.82,
        ),
        createEvidence(
          'ev_fam_dest_2',
          '冲绳新意图',
          '客服咨询下个月冲绳家庭度假。',
          'support_ticket',
          ['evt_fam_08'],
          0.81,
        ),
        createEvidence(
          'ev_fam_style_1',
          '多晚家庭住',
          '订单为 4 晚，家庭出行人数固定。',
          'complete_booking',
          ['evt_fam_05'],
          0.8,
        ),
        createEvidence(
          'ev_fam_style_2',
          '景点导向',
          '搜索集中在环球影城与亲子景点圈层。',
          'search',
          ['evt_fam_01'],
          0.78,
        ),
        createEvidence(
          'ev_fam_srv_1',
          '省心方案期待',
          '客服咨询希望直接得到合适房型与早餐组合。',
          'support_ticket',
          ['evt_fam_08'],
          0.79,
        ),
        createEvidence(
          'ev_fam_risk_1',
          '高取消弹性',
          '活动敏感且对价格差异有即时反应。',
          'cancel_booking',
          ['evt_fam_04', 'evt_fam_03'],
          0.88,
        ),
        createEvidence(
          'ev_fam_value_1',
          '权益驱动复购',
          '领券后启动预订，完成订单时带儿童增值权益。',
          'start_booking',
          ['evt_fam_03', 'evt_fam_05'],
          0.75,
        ),
        createEvidence(
          'ev_fam_intent_1',
          '下次出游要求明确',
          '冲绳 + 儿童早餐 + 连通房的组合偏好已出现。',
          'support_ticket',
          ['evt_fam_08'],
          0.87,
        ),
      ],
      change_log: [
        {
          id: 'fam_change_1',
          timestamp: '2026-04-09T14:11:00Z',
          title: '新增冲绳意图',
          detail: '客服咨询将下次出游目的地明确为冲绳。',
        },
        {
          id: 'fam_change_2',
          timestamp: '2026-03-10T07:13:00Z',
          title: '价格敏感度上调',
          detail: '因更低价格取消并重订，价格敏感 trait 置信度上升。',
        },
      ],
    },
    contextPack: {
      id: 'ctx_family_value_hunter',
      profileId: 'profile_family_value_hunter',
      personaId: 'family_value_hunter',
      generatedAt: '2026-04-09T15:05:00Z',
      allowed_use_scope: ['recommendation', 'service-assist', 'campaign-targeting'],
      identity_summary: {
        traveler_archetype: '家庭价值型',
        home_market: '杭州，中国',
        preferred_channels: 'Trip app / Booking web',
        loyalty_posture: '对优惠与亲子权益敏感',
      },
      stable_preferences: [
        '优先儿童早餐、接驳和游乐区',
        '能接受中高星，但必须有活动或高性价比',
        '偏好连通房或可洗衣的家庭房',
      ],
      recent_intents: ['计划下个月带孩子去冲绳，继续寻找亲子友好酒店'],
      risk_flags: ['若出现更低价格或权益模糊，取消 / 改订风险较高'],
      value_signals: ['对促销券响应高', '有多晚家庭入住潜力', '可承接亲子权益包'],
      explanations: [
        '价格波动对成交影响明显，但一旦亲子权益明确，转化意愿会上升。',
      ],
    },
    evaluation: {
      overallScore: 91,
      mappingCoverage: 97,
      traitF1: 0.89,
      contradictionRate: 0.02,
      freshnessSla: '< 12h',
      alerts: ['价格敏感与高价值权益响应需要在文案中同时体现。'],
    },
    agentTemplates: {
      recommendation: {
        type: 'recommendation',
        title: '推荐 Agent 输出',
        response:
          '推荐优先展示冲绳家庭酒店和家庭套房，文案强调“儿童早餐免费”“接驳方便”“连通房可选”，并把优惠券或早订折扣放在首屏。',
        confidence: 0.9,
        citations: ['价格敏感 trait', '冲绳客服咨询', '亲子设施偏好'],
        actionItems: [
          '首屏显示亲子标签和可取消政策',
          '同时展示带洗衣设施的房型',
        ],
      },
      support: {
        type: 'support',
        title: '服务 Agent 输出',
        response:
          '建议客服直接提供 3 组“儿童早餐 + 连通房 / 洗衣设施”的酒店选项，并明确每组是否支持免费取消和优惠券叠加。',
        confidence: 0.88,
        citations: ['亲子设施偏好', '高取消弹性', '冲绳新意图'],
        actionItems: [
          '先说明最省心的家庭房组合',
          '同步提醒券后价与取消窗口',
        ],
      },
    },
  },
  luxury_escape_curator: {
    summary: {
      id: 'luxury_escape_curator',
      displayName: '秦绍衡',
      headline: '高端休闲度假用户，偏爱稀缺景观、隐私感和完整服务打包',
      homeMarket: '深圳，中国',
      travelArchetype: '高端度假',
      spotlight: '愿为稀缺体验与服务确定性支付高溢价',
      rawEventCount: 8,
      traitCount: 12,
      tags: ['高净值', '度假', '体验导向'],
      highlightMetrics: [
        { label: '单次预算', value: '$5k+' },
        { label: '服务期待', value: '白手套' },
        { label: '升级概率', value: '高' },
      ],
    },
    rawEvents: [
      {
        id: 'evt_lux_01',
        personaId: 'luxury_escape_curator',
        source: 'curated_partner_feed',
        sourceLabel: 'Luxury partner feed',
        type: 'search',
        timestamp: '2026-02-20T06:00:00Z',
        sessionId: 'sess_lux_maldives_01',
        channel: 'app',
        summary: '搜索马尔代夫水屋 5 晚，筛选私人泳池、SPA 和水上飞机接送。',
        payload: {
          destination: 'Maldives North Male Atoll',
          checkIn: '2026-05-18',
          nights: 5,
          travelers: 2,
          filters: ['private pool', 'spa', 'seaplane', 'butler'],
        },
      },
      {
        id: 'evt_lux_02',
        personaId: 'luxury_escape_curator',
        source: 'curated_partner_feed',
        sourceLabel: 'Luxury partner browse',
        type: 'view_property',
        timestamp: '2026-02-20T06:12:00Z',
        sessionId: 'sess_lux_maldives_01',
        channel: 'app',
        summary: '查看两家顶级海岛别墅，对比私人泳池尺度、SPA 套餐和私密性。',
        payload: {
          propertyName: 'Aurelia Overwater Retreat',
          destination: 'Maldives North Male Atoll',
          nightlyRateUsd: 1180,
          highlights: ['private butler', 'spa rituals', 'sunset deck'],
        },
      },
      {
        id: 'evt_lux_03',
        personaId: 'luxury_escape_curator',
        source: 'luxury_concierge',
        sourceLabel: 'Concierge desk',
        type: 'start_booking',
        timestamp: '2026-02-20T06:28:00Z',
        sessionId: 'sess_lux_maldives_01',
        channel: 'support',
        summary: '联系礼宾团队确认接机、水上飞机和私人摄影师是否可打包。',
        payload: {
          propertyName: 'Aurelia Overwater Retreat',
          asks: ['airport transfer', 'seaplane', 'private photographer'],
        },
      },
      {
        id: 'evt_lux_04',
        personaId: 'luxury_escape_curator',
        source: 'curated_partner_feed',
        sourceLabel: 'Luxury partner booking',
        type: 'complete_booking',
        timestamp: '2026-02-20T06:42:00Z',
        sessionId: 'sess_lux_maldives_01',
        channel: 'support',
        summary: '完成 5 晚水屋预订，总价 5900 美元，含 SPA 和水上飞机。',
        payload: {
          propertyName: 'Aurelia Overwater Retreat',
          destination: 'Maldives North Male Atoll',
          totalValueUsd: 5900,
          addOns: ['spa rituals', 'seaplane', 'private photographer'],
        },
      },
      {
        id: 'evt_lux_05',
        personaId: 'luxury_escape_curator',
        source: 'luxury_stay_ledger',
        sourceLabel: 'Luxury stay ledger',
        type: 'stay',
        timestamp: '2026-05-24T12:00:00Z',
        sessionId: 'sess_lux_maldives_01',
        channel: 'partner',
        summary: '完成入住，使用管家、SPA、摄影和 sunset dining 套餐。',
        payload: {
          propertyName: 'Aurelia Overwater Retreat',
          amenitiesUsed: ['private butler', 'spa rituals', 'photographer', 'sunset dining'],
        },
      },
      {
        id: 'evt_lux_06',
        personaId: 'luxury_escape_curator',
        source: 'luxury_reviews',
        sourceLabel: 'Luxury review stream',
        type: 'review',
        timestamp: '2026-05-25T08:00:00Z',
        sessionId: 'sess_lux_maldives_01',
        channel: 'app',
        summary: '评价 4.9 分，称赞私密感和服务主动性，希望未来能推荐更安静的日落水屋。',
        payload: {
          rating: 4.9,
          text: '管家和私密感都很好，日落餐很惊艳。下次如果能更偏静一点会更喜欢。',
        },
      },
      {
        id: 'evt_lux_07',
        personaId: 'luxury_escape_curator',
        source: 'luxury_concierge',
        sourceLabel: 'Concierge desk',
        type: 'support_ticket',
        timestamp: '2026-05-25T08:30:00Z',
        sessionId: 'sess_lux_next_01',
        channel: 'support',
        summary: '向礼宾咨询今年周年纪念是否有巴厘岛或波拉波拉的水上别墅推荐。',
        payload: {
          ticketTopic: 'anniversary planning',
          urgency: 'medium',
          transcript:
            '明年周年纪念想看更安静、私密性更好的海岛，巴厘岛或者波拉波拉都可以，最好是 sunset villa。',
        },
      },
      {
        id: 'evt_lux_08',
        personaId: 'luxury_escape_curator',
        source: 'curated_partner_feed',
        sourceLabel: 'Luxury search feed',
        type: 'search',
        timestamp: '2026-05-25T09:10:00Z',
        sessionId: 'sess_lux_next_01',
        channel: 'app',
        summary: '搜索波拉波拉 4 晚日落水屋，筛选私密沙滩和周年纪念服务。',
        payload: {
          destination: 'Bora Bora',
          checkIn: '2027-01-10',
          nights: 4,
          travelers: 2,
          filters: ['sunset villa', 'privacy', 'anniversary setup'],
        },
      },
    ],
    canonicalEvents: [
      {
        id: 'cn_lux_01',
        rawEventId: 'evt_lux_01',
        personaId: 'luxury_escape_curator',
        eventType: 'search',
        occurredAt: '2026-02-20T06:00:00Z',
        destination: 'Maldives North Male Atoll',
        bookingWindowDays: 87,
        partyType: 'couple-luxury',
        summary: '搜索高端海岛水屋，关注私密性与服务打包。',
        normalized: {
          filters: ['private_pool', 'spa', 'seaplane', 'butler'],
          stayLengthNights: 5,
        },
      },
      {
        id: 'cn_lux_02',
        rawEventId: 'evt_lux_02',
        personaId: 'luxury_escape_curator',
        eventType: 'view_property',
        occurredAt: '2026-02-20T06:12:00Z',
        destination: 'Maldives North Male Atoll',
        valueUsd: 1180,
        summary: '比较别墅景观尺度和私密体验。',
        normalized: {
          propertyName: 'Aurelia Overwater Retreat',
          privacyPreference: 'high',
        },
      },
      {
        id: 'cn_lux_03',
        rawEventId: 'evt_lux_03',
        personaId: 'luxury_escape_curator',
        eventType: 'start_booking',
        occurredAt: '2026-02-20T06:28:00Z',
        summary: '预订前确认礼宾打包服务。',
        normalized: {
          conciergeRequired: true,
          bundledAddOns: ['airport transfer', 'seaplane', 'private photographer'],
        },
      },
      {
        id: 'cn_lux_04',
        rawEventId: 'evt_lux_04',
        personaId: 'luxury_escape_curator',
        eventType: 'complete_booking',
        occurredAt: '2026-02-20T06:42:00Z',
        destination: 'Maldives North Male Atoll',
        valueUsd: 5900,
        bookingWindowDays: 87,
        partyType: 'couple-luxury',
        summary: '完成高客单周年度假预订。',
        normalized: {
          addOns: ['spa rituals', 'seaplane', 'private photographer'],
          highTouchService: true,
        },
      },
      {
        id: 'cn_lux_05',
        rawEventId: 'evt_lux_05',
        personaId: 'luxury_escape_curator',
        eventType: 'stay',
        occurredAt: '2026-05-24T12:00:00Z',
        destination: 'Maldives North Male Atoll',
        summary: '使用管家和稀缺体验套餐。',
        normalized: {
          amenityUsage: ['private butler', 'spa rituals', 'photographer', 'sunset dining'],
        },
      },
      {
        id: 'cn_lux_06',
        rawEventId: 'evt_lux_06',
        personaId: 'luxury_escape_curator',
        eventType: 'review',
        occurredAt: '2026-05-25T08:00:00Z',
        destination: 'Maldives North Male Atoll',
        summary: '评论强调私密感和更静谧的日落水屋。',
        normalized: {
          rating: 4.9,
          topics: ['privacy', 'service', 'sunset villa'],
        },
      },
      {
        id: 'cn_lux_07',
        rawEventId: 'evt_lux_07',
        personaId: 'luxury_escape_curator',
        eventType: 'support_ticket',
        occurredAt: '2026-05-25T08:30:00Z',
        summary: '咨询周年纪念海岛推荐。',
        normalized: {
          nextOccasion: 'anniversary',
          destinations: ['Bali', 'Bora Bora'],
        },
      },
      {
        id: 'cn_lux_08',
        rawEventId: 'evt_lux_08',
        personaId: 'luxury_escape_curator',
        eventType: 'search',
        occurredAt: '2026-05-25T09:10:00Z',
        destination: 'Bora Bora',
        bookingWindowDays: 230,
        partyType: 'couple-luxury',
        summary: '搜索周年纪念向的日落水屋。',
        normalized: {
          filters: ['sunset villa', 'privacy', 'anniversary setup'],
          stayLengthNights: 4,
        },
      },
    ],
    profile: {
      id: 'profile_luxury_escape_curator',
      personaId: 'luxury_escape_curator',
      displayName: '秦绍衡',
      headline: '高端休闲度假用户，偏爱稀缺景观、隐私感和完整服务打包',
      overview:
        '画像显示其偏爱高单价海岛度假，并且更看重稀缺景观、私密感和礼宾主导的完整服务方案。',
      lastUpdatedAt: '2026-05-25T10:00:00Z',
      identity_summary: {
        traveler_archetype: '高端度假',
        home_market: '深圳，中国',
        preferred_channels: ['Luxury app concierge', 'curated partner'],
        loyalty_posture: '对高质量礼宾体验有明显忠诚',
        party_signature: '情侣 / 纪念日',
        booking_window_pattern: '平均提前 3-7 个月',
      },
      travel_preferences: [
        createTrait(
          'lux_pref_1',
          '景观偏好',
          '日落水屋、私密沙滩、安静房位',
          0.94,
          '2026-05-25T09:10:00Z',
          ['ev_lux_pref_1', 'ev_lux_pref_2'],
          '评价与后续搜索都朝更私密、安静的日落水屋收敛。',
          'rising',
        ),
        createTrait(
          'lux_pref_2',
          '服务偏好',
          '管家 + SPA + 转运 + 摄影一体化打包',
          0.93,
          '2026-05-24T12:00:00Z',
          ['ev_lux_pref_3'],
          '预订与入住行为都表明其愿意购买完整高端服务包。',
          'stable',
        ),
      ],
      price_sensitivity: createTrait(
        'lux_price_1',
        'Price posture',
        '低价格敏感，稀缺体验优先',
        0.97,
        '2026-02-20T06:42:00Z',
        ['ev_lux_price_1'],
        '高客单成交并购买多项高端附加服务。',
        'stable',
      ),
      destination_affinity: [
        createTrait(
          'lux_dest_1',
          '目的地偏好',
          '马尔代夫高端海岛',
          0.92,
          '2026-05-25T08:00:00Z',
          ['ev_lux_dest_1'],
          '完成入住且满意度极高。',
          'stable',
        ),
        createTrait(
          'lux_dest_2',
          '目的地偏好',
          '波拉波拉周年纪念型度假',
          0.83,
          '2026-05-25T09:10:00Z',
          ['ev_lux_dest_2'],
          '后续搜索与礼宾咨询高度一致。',
          'rising',
        ),
      ],
      trip_style: [
        createTrait(
          'lux_style_1',
          '出行动机',
          '周年纪念 / 情侣度假',
          0.91,
          '2026-05-25T08:30:00Z',
          ['ev_lux_style_1'],
          '礼宾咨询直接提到周年纪念。',
          'stable',
        ),
        createTrait(
          'lux_style_2',
          '住宿节奏',
          '4-5 晚高端海岛沉浸式度假',
          0.89,
          '2026-05-25T09:10:00Z',
          ['ev_lux_style_2'],
          '搜索与已完成订单都集中于 4-5 晚海岛度假。',
          'stable',
        ),
      ],
      service_expectation: [
        createTrait(
          'lux_srv_1',
          '服务风格',
          '白手套礼宾，偏好主动型服务',
          0.95,
          '2026-05-24T12:00:00Z',
          ['ev_lux_srv_1'],
          '多次主动与礼宾沟通，并使用管家服务。',
          'stable',
        ),
      ],
      risk_flags: [
        createTrait(
          'lux_risk_1',
          '体验风险',
          '若景观和私密感不达预期，满意度会明显受损',
          0.74,
          '2026-05-25T08:00:00Z',
          ['ev_lux_risk_1'],
          '评论中点名希望下次更安静的日落水屋。',
          'watch',
        ),
      ],
      value_band: createTrait(
        'lux_value_1',
        'Value band',
        '超高价值 / 高附加服务渗透率',
        0.98,
        '2026-02-20T06:42:00Z',
        ['ev_lux_value_1'],
        '高客单、高附加服务、高复购潜力同时成立。',
        'stable',
      ),
      recent_intents: [
        createTrait(
          'lux_intent_1',
          '当前意图',
          '为周年纪念寻找更安静、私密的波拉波拉日落水屋',
          0.92,
          '2026-05-25T09:10:00Z',
          ['ev_lux_intent_1'],
          '礼宾咨询和搜索形成双重强信号。',
          'rising',
        ),
      ],
      evidence: [
        createEvidence(
          'ev_lux_pref_1',
          '日落水屋搜索',
          '最新搜索明确筛选 sunset villa 和 privacy。',
          'search',
          ['evt_lux_08'],
          0.91,
        ),
        createEvidence(
          'ev_lux_pref_2',
          '评价想要更静谧',
          '“下次如果能更偏静一点会更喜欢。”',
          'review',
          ['evt_lux_06'],
          0.8,
        ),
        createEvidence(
          'ev_lux_pref_3',
          '礼宾打包服务',
          '预订前确认接机、水上飞机和摄影师是否可打包。',
          'start_booking',
          ['evt_lux_03'],
          0.93,
        ),
        createEvidence(
          'ev_lux_price_1',
          '高客单成交',
          '5 晚总价 5900 美元，带多项奢华附加服务。',
          'complete_booking',
          ['evt_lux_04'],
          0.95,
        ),
        createEvidence(
          'ev_lux_dest_1',
          '马代高分入住',
          '高分评价与高附加服务使用共同确认偏好。',
          'stay',
          ['evt_lux_05', 'evt_lux_06'],
          0.86,
        ),
        createEvidence(
          'ev_lux_dest_2',
          '波拉波拉新意图',
          '礼宾和搜索都指向 Bora Bora。',
          'search',
          ['evt_lux_07', 'evt_lux_08'],
          0.88,
        ),
        createEvidence(
          'ev_lux_style_1',
          '周年纪念场景',
          '礼宾咨询直接说“周年纪念”。',
          'support_ticket',
          ['evt_lux_07'],
          0.9,
        ),
        createEvidence(
          'ev_lux_style_2',
          '高端沉浸式度假',
          '订单与后续搜索都在 4-5 晚海岛度假区间。',
          'complete_booking',
          ['evt_lux_04', 'evt_lux_08'],
          0.84,
        ),
        createEvidence(
          'ev_lux_srv_1',
          '白手套服务',
          '入住实际使用 private butler、photographer 和 sunset dining。',
          'stay',
          ['evt_lux_05'],
          0.94,
        ),
        createEvidence(
          'ev_lux_risk_1',
          '静谧度要求',
          '明确希望更安静的房位和更强隐私感。',
          'review',
          ['evt_lux_06'],
          0.77,
        ),
        createEvidence(
          'ev_lux_value_1',
          '高附加服务渗透',
          '接机、SPA、摄影师全部打包成交。',
          'complete_booking',
          ['evt_lux_04'],
          0.96,
        ),
        createEvidence(
          'ev_lux_intent_1',
          '纪念日高意图',
          '波拉波拉日落水屋搜索与礼宾对话高度一致。',
          'search',
          ['evt_lux_07', 'evt_lux_08'],
          0.93,
        ),
      ],
      change_log: [
        {
          id: 'lux_change_1',
          timestamp: '2026-05-25T09:12:00Z',
          title: '新增波拉波拉周年纪念意图',
          detail: '搜索与礼宾咨询共同触发新的高意图旅程。',
        },
        {
          id: 'lux_change_2',
          timestamp: '2026-05-25T08:02:00Z',
          title: '景观静谧偏好增强',
          detail: '评论显示其对房位安静度和私密感的要求进一步提升。',
        },
      ],
    },
    contextPack: {
      id: 'ctx_luxury_escape_curator',
      profileId: 'profile_luxury_escape_curator',
      personaId: 'luxury_escape_curator',
      generatedAt: '2026-05-25T10:05:00Z',
      allowed_use_scope: ['recommendation', 'service-assist', 'concierge'],
      identity_summary: {
        traveler_archetype: '高端度假',
        home_market: '深圳，中国',
        preferred_channels: 'Luxury concierge / curated partner',
        loyalty_posture: '对白手套礼宾服务有明显忠诚',
      },
      stable_preferences: [
        '偏好日落水屋、私密沙滩和更安静的房位',
        '愿为管家、SPA、摄影、转运打包方案支付高溢价',
        '更喜欢由礼宾主动设计完整纪念日旅程',
      ],
      recent_intents: ['为周年纪念寻找波拉波拉 4 晚日落水屋'],
      risk_flags: ['若景观或私密感不达预期，体验满意度会快速下降'],
      value_signals: ['单次预算 5k+ 美元', '高附加服务购买意愿强', '礼宾复购潜力高'],
      explanations: [
        '该画像的核心不是价格，而是稀缺体验和服务确定性。',
      ],
    },
    evaluation: {
      overallScore: 95,
      mappingCoverage: 99,
      traitF1: 0.93,
      contradictionRate: 0.01,
      freshnessSla: '< 24h',
      alerts: ['推荐时需强调私密感与景观，不宜只堆豪华设施。'],
    },
    agentTemplates: {
      recommendation: {
        type: 'recommendation',
        title: '推荐 Agent 输出',
        response:
          '建议推荐波拉波拉或巴厘岛的日落水屋，重点强调“私密感”“周年纪念场景设计”“礼宾全程打包”，并优先展示更安静的 villa 房位。',
        confidence: 0.94,
        citations: ['周年纪念咨询', '日落水屋搜索', '白手套服务偏好'],
        actionItems: [
          '推荐文案优先讲场景和稀缺体验',
          '优先展示可安排摄影和 sunset dining 的房源',
        ],
      },
      support: {
        type: 'support',
        title: '服务 Agent 输出',
        response:
          '建议礼宾式沟通，直接给出 2 套周年纪念方案：一套偏波拉波拉的静谧日落水屋，一套偏巴厘岛悬崖别墅，并附带摄影、SPA 和接送的完整 itinerary。',
        confidence: 0.93,
        citations: ['周年纪念意图', '高端服务打包偏好', '静谧景观偏好'],
        actionItems: [
          '避免只提供标准搜索结果列表',
          '先给方案，再补价格与可订性',
        ],
      },
    },
  },
}

function deepClone<T>(value: T): T {
  return structuredClone(value)
}

function getPersonaBlueprint(personaId: PersonaId): PersonaBlueprint {
  return deepClone(personaBlueprints[personaId])
}

function createStageResults(
  blueprint: PersonaBlueprint,
  createdAt: string,
  agentReplays: AgentReplay[],
): PipelineStageResult[] {
  const { rawEvents, canonicalEvents, profile, contextPack, evaluation } = blueprint

  return [
    {
      id: 'source-intake',
      title: 'Source Intake',
      agentLabel: 'Connector Runtime',
      description: '接收入站原始事件并检查批次质量。',
      status: 'pending',
      durationMs: 1200,
      score: 99,
      highlights: [
        `${rawEvents.length} 条原始事件进入 bronze 层`,
        '来源字段无缺失，批次可重放',
      ],
      explanation: '这一阶段模拟 Booking / Trip.com 授权数据进入平台的第一站。',
      inputSample: rawEvents.slice(0, 2),
      outputSample: {
        sourceBatchId: `bronze_${blueprint.summary.id}`,
        receivedAt: createdAt,
        eventTypes: rawEvents.map((event) => event.type),
      },
    },
    {
      id: 'schema-mapping-agent',
      title: 'Schema Mapping Agent',
      agentLabel: 'Mapping Agent',
      description: '把 OTA 风格字段统一成标准事件模型。',
      status: 'pending',
      durationMs: 1300,
      score: evaluation.mappingCoverage,
      highlights: ['统一事件类型', '补齐目的地、客群和金额字段'],
      explanation: '该 Agent 把不同来源的 payload 映射为统一的 CanonicalEvent schema。',
      inputSample: rawEvents.slice(0, 3),
      outputSample: canonicalEvents.slice(0, 3),
    },
    {
      id: 'identity-resolver',
      title: 'Identity Resolver',
      agentLabel: 'Resolution Engine',
      description: '聚合多来源身份键，归并到统一 profile_id。',
      status: 'pending',
      durationMs: 1000,
      score: 97,
      highlights: ['账号、设备与订单旅客信息归一', '合并置信度高于阈值'],
      explanation: 'Demo 中默认所有事件都成功收敛到一个 profile_id，强调流程完整性。',
      inputSample: canonicalEvents.map((event) => ({
        id: event.id,
        destination: event.destination,
        partyType: event.partyType,
      })),
      outputSample: {
        profileId: profile.id,
        identitySummary: profile.identity_summary,
        mergeConfidence: 0.97,
      },
    },
    {
      id: 'enrichment-agent',
      title: 'Enrichment Agent',
      agentLabel: 'Signal Extractor',
      description: '从评论、客服对话和文本字段中抽取细颗粒偏好。',
      status: 'pending',
      durationMs: 1600,
      score: 93,
      highlights: ['评论文本抽取', '客服对话抽取', '生成 evidence 引用'],
      explanation: '这一层让平台不只知道“做过什么”，还能知道“为什么”和“在意什么”。',
      inputSample: rawEvents.filter((event) =>
        event.type === 'review' || event.type === 'support_ticket'
      ),
      outputSample: profile.evidence.slice(0, 4),
    },
    {
      id: 'profile-synthesizer',
      title: 'Profile Synthesizer',
      agentLabel: 'Profile Composer',
      description: '融合行为和抽取信号，写入可解释画像。',
      status: 'pending',
      durationMs: 1700,
      score: Math.round(evaluation.traitF1 * 100),
      highlights: ['所有 trait 都带 evidence', '输出稳定偏好、风险和价值信号'],
      explanation: '画像层不是一段摘要，而是一组可供 Agent 调用的结构化 trait。',
      inputSample: {
        canonicalEvents: canonicalEvents.length,
        evidence: profile.evidence.length,
      },
      outputSample: {
        identity_summary: profile.identity_summary,
        travel_preferences: profile.travel_preferences,
        price_sensitivity: profile.price_sensitivity,
        recent_intents: profile.recent_intents,
      },
    },
    {
      id: 'qa-agent',
      title: 'QA Agent',
      agentLabel: 'Quality Gate',
      description: '对映射质量、trait 准确率和矛盾率做上线前校验。',
      status: 'pending',
      durationMs: 1100,
      score: evaluation.overallScore,
      highlights: [
        `mapping coverage ${evaluation.mappingCoverage}%`,
        `trait F1 ${(evaluation.traitF1 * 100).toFixed(0)}%`,
      ],
      explanation: '只有通过质量门的版本，才会被发布给下游 Agent 消费。',
      inputSample: {
        overallScore: evaluation.overallScore,
        mappingCoverage: evaluation.mappingCoverage,
        traitF1: evaluation.traitF1,
      },
      outputSample: evaluation,
    },
    {
      id: 'context-publisher',
      title: 'Context Publisher',
      agentLabel: 'Context Pack Builder',
      description: '将画像裁剪成对下游 Agent 友好的 Context Pack。',
      status: 'pending',
      durationMs: 900,
      score: 98,
      highlights: ['权限范围标记', '输出简洁但可解释的上下文'],
      explanation: '下游 Agent 不需要自己重放所有事件，只读取裁剪后的 Context Pack。',
      inputSample: {
        profileId: profile.id,
        valueBand: profile.value_band.value,
        riskFlags: profile.risk_flags.length,
      },
      outputSample: contextPack,
    },
    {
      id: 'reco-service-agent',
      title: 'Reco/Service Agent',
      agentLabel: 'Downstream Consumers',
      description: '展示推荐 Agent 与服务 Agent 如何消费画像。',
      status: 'pending',
      durationMs: 1400,
      score: 95,
      highlights: ['推荐 Agent 个性化文案', '服务 Agent 决策建议'],
      explanation: '最终目标不是存画像本身，而是让推荐和服务系统真的用起来。',
      inputSample: contextPack,
      outputSample: agentReplays,
    },
  ]
}

export function getJourneyStageGraph(): JourneyStageDescriptor[] {
  return deepClone(stageGraph)
}

export function getDemoCatalog(): DemoCatalog {
  const blueprints = personaIds.map((personaId) => getPersonaBlueprint(personaId))

  return {
    personas: blueprints.map((blueprint) => blueprint.summary),
    overviewMetrics: [
      { id: 'profiles', label: '沉淀画像数', value: '3', delta: '+3 seed personas', tone: 'good' },
      {
        id: 'quality',
        label: '平均质量分',
        value: `${Math.round(
          blueprints.reduce((sum, blueprint) => sum + blueprint.evaluation.overallScore, 0) /
            blueprints.length,
        )}`,
        delta: '+4 vs baseline',
        tone: 'good',
      },
      {
        id: 'agent-calls',
        label: '可回放 Agent 调用',
        value: '6',
        delta: '2 per persona',
        tone: 'neutral',
      },
      {
        id: 'sources',
        label: '模拟授权源',
        value: '2',
        delta: 'Booking + Trip style',
        tone: 'neutral',
      },
    ],
    stageGraph: getJourneyStageGraph(),
    segmentDefinitions: [
      {
        id: 'seg_business_priority',
        name: '高频商旅优先队列',
        description: '位置效率与发票链路敏感，适合推荐商务保障型房源。',
        criteria: ['traveler_archetype = 高频商旅', 'invoice related evidence >= 1'],
        estimatedReach: 1240,
        lastSyncedAt: '2026-03-26T10:00:00Z',
      },
      {
        id: 'seg_family_coupon',
        name: '亲子权益 + 券包人群',
        description: '对儿童设施和优惠券敏感，适合运营亲子权益活动。',
        criteria: ['family preference trait', 'price sensitivity = high'],
        estimatedReach: 3860,
        lastSyncedAt: '2026-04-10T09:00:00Z',
      },
      {
        id: 'seg_luxury_concierge',
        name: '礼宾式高端度假人群',
        description: '适合由人工或高触达 Agent 提供定制方案。',
        criteria: ['value band = ultra high', 'service expectation contains concierge'],
        estimatedReach: 280,
        lastSyncedAt: '2026-05-25T12:00:00Z',
      },
    ],
    evaluationSnapshots: blueprints.map((blueprint) => ({
      personaId: blueprint.summary.id,
      displayName: blueprint.summary.displayName,
      overallScore: blueprint.evaluation.overallScore,
      mappingCoverage: blueprint.evaluation.mappingCoverage,
      traitF1: blueprint.evaluation.traitF1,
      contradictionRate: blueprint.evaluation.contradictionRate,
      status: blueprint.evaluation.overallScore >= 92 ? 'healthy' : 'watch',
    })),
  }
}

export function getPersonaProfile(personaId: PersonaId): UnifiedProfile {
  return getPersonaBlueprint(personaId).profile
}

export function getPersonaContextPack(personaId: PersonaId): AgentContextPack {
  return getPersonaBlueprint(personaId).contextPack
}

export function getPersonaSummary(personaId: PersonaId): PersonaSummary {
  return getPersonaBlueprint(personaId).summary
}

export function getPersonaRawEvents(personaId: PersonaId): RawEventRecord[] {
  return getPersonaBlueprint(personaId).rawEvents
}

export function getPersonaCanonicalEvents(personaId: PersonaId): CanonicalEvent[] {
  return getPersonaBlueprint(personaId).canonicalEvents
}

export function getPersonaEvaluation(personaId: PersonaId): EvaluationSummary {
  return getPersonaBlueprint(personaId).evaluation
}

export function createAgentReplay(
  personaId: PersonaId,
  useCase: AgentUseCase,
  prompt?: string,
): AgentReplay {
  const blueprint = getPersonaBlueprint(personaId)
  const template = blueprint.agentTemplates[useCase]

  return {
    id: `agent_${useCase}_${personaId}_${Date.now()}`,
    personaId,
    prompt:
      prompt?.trim() ||
      (useCase === 'recommendation'
        ? '请基于当前画像给出下一次推荐策略。'
        : '请基于当前画像给出客服处理建议。'),
    ...template,
  }
}

export function buildPipelineRun(personaId: PersonaId): PipelineRun {
  const blueprint = getPersonaBlueprint(personaId)
  const createdAt = new Date().toISOString()
  const agentReplays = [
    createAgentReplay(personaId, 'recommendation'),
    createAgentReplay(personaId, 'support'),
  ]

  return {
    id: `run_${personaId}_${Date.now()}`,
    personaId,
    createdAt,
    persona: blueprint.summary,
    rawEvents: blueprint.rawEvents,
    canonicalEvents: blueprint.canonicalEvents,
    profile: {
      ...blueprint.profile,
      lastUpdatedAt: createdAt,
    },
    contextPack: {
      ...blueprint.contextPack,
      generatedAt: createdAt,
    },
    stages: createStageResults(blueprint, createdAt, agentReplays),
    agentReplays,
    evaluation: blueprint.evaluation,
  }
}
