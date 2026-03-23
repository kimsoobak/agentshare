export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-16">
        <p className="text-xs text-muted uppercase tracking-widest mb-4">About</p>
        <h1 className="text-5xl font-bold text-text leading-tight tracking-tight">
          전문가의 깊이를<br />AI로
        </h1>
        <p className="text-mid text-lg mt-4 max-w-xl leading-relaxed">
          빅테크의 AI는 강력하지만 얕습니다.<br />
          AgentShare는 수십 년 경험이 담긴 에이전트를 직접 거래합니다.
        </p>
      </div>

      <div className="space-y-16">

        {/* Why */}
        <section>
          <h2 className="text-2xl font-bold text-text mb-6">왜 AgentShare인가</h2>
          <div className="space-y-5 text-mid leading-relaxed text-[1.05rem]">
            <p>
              GPT는 세무사 시험을 통과합니다. 하지만 당신의 법인 구조, 3년치 세금 이력,
              절세 타이밍을 꿰고 있는 10년 차 세무사를 이길 수 없습니다.
            </p>
            <p>
              지식과 경험은 다릅니다. AI가 아무리 발전해도,
              수십 년을 한 분야에 바친 사람의 직관과 판단은 다른 차원의 것입니다.
            </p>
            <p>
              우리는 그 차이를 제품으로 만들기로 했습니다.
            </p>
          </div>
        </section>

        {/* What */}
        <section className="bg-accent/5 border border-accent/20 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-text mb-6">AgentShare가 하는 일</h2>
          <div className="space-y-5 text-mid leading-relaxed text-[1.05rem]">
            <p>
              전문가가 자신의 노하우로 에이전트를 만들고,<br />
              그것을 필요한 사람에게 직접 판매합니다.
            </p>
            <p>
              중간에 빅테크가 없습니다. 수수료가 없습니다.<br />
              사람 대 사람입니다.
            </p>
            <p className="text-text font-semibold">
              당근마켓처럼, 단 이번엔 전문성이 거래됩니다.
            </p>
          </div>
        </section>

        {/* Vision */}
        <section>
          <h2 className="text-2xl font-bold text-text mb-6">우리가 만드는 세상</h2>
          <div className="space-y-5 text-mid leading-relaxed text-[1.05rem]">
            <p>
              10년 차 세무사의 절세 감각,<br />
              15년 경력 한의사의 체질 분석,<br />
              스타트업 CTO의 코드 리뷰 직관.
            </p>
            <p>
              이 깊이들이 AI로 민주화되어야 합니다.<br />
              최고의 전문가를 만날 기회가 모두에게 열려야 합니다.
            </p>
            <p>
              AgentShare는 그 다리입니다.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center pt-10 border-t border-border">
          <p className="text-text text-xl font-semibold mb-3">당신의 전문성이 AI가 될 수 있습니다.</p>
          <p className="text-muted mb-8">지금 에이전트를 등록하고 세상과 나누세요.</p>
          <a
            href="/register"
            className="inline-block bg-accent hover:bg-accent-dark text-white px-10 py-4 rounded-full font-semibold transition-colors text-lg"
          >
            에이전트 등록하기
          </a>
        </section>

      </div>
    </div>
  )
}
