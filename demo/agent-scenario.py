import json
import subprocess
import os

CLI_PATH = os.path.expanduser("~/develop/git/3ridge-cli/dist/bin/3ridge.js")
CLI = ["node", CLI_PATH]

def cli_call(args):
    result = subprocess.run(CLI + args, capture_output=True, text=True)
    return json.loads(result.stdout)

print("=" * 60)
print("  IR Demo: AI Agent + 3ridge MCP Data")
print("=" * 60)
print()
print('User: "현재 진행 중인 캠페인 중 참여자가 가장 많은 3개를 비교 분석해줘"')
print()

# Step 1: list campaigns
print("[Agent] Step 1: list_campaigns(visible_only=true)")
campaigns = cli_call(["campaigns", "list", "--visible"])
top3 = sorted(campaigns, key=lambda x: x["participants"], reverse=True)[:3]
print(f"  -> {len(campaigns)} campaigns found, top 3 selected")
print()

# Step 2: get stats for each
print("[Agent] Step 2: get_campaign_stats() x3")
stats = []
for c in top3:
    s = cli_call(["campaigns", "stats", c["id"]])
    stats.append(s)
    print(f"  -> {s['title'][:35]}: {s['participantCount']} participants")
print()

# Step 3: get rewards for each
print("[Agent] Step 3: get_rewards_summary() x3")
rewards = []
for c in top3:
    r = cli_call(["rewards", "summary", c["id"]])
    rewards.append(r)
    print(f"  -> {r.get('campaignTitle', c['title'])[:35]}: {r.get('rewardType', 'N/A')}")
print()

# Step 4: Agent synthesizes
print("=" * 60)
print("  Agent Response")
print("=" * 60)
print()
print(f"현재 진행 중인 {len(campaigns)}개 캠페인 중")
print(f"참여자가 가장 많은 상위 3개를 분석했습니다.")
print()

header = f"{'#':<3} {'캠페인':<35} {'참여자':<10} {'퀘스트':<8} {'보상유형':<20} {'기간'}"
print(header)
print("-" * len(header) + "-" * 20)
for i, (s, r) in enumerate(zip(stats, rewards), 1):
    reward_desc = r.get("description", "-")[:18] if r.get("description") else "-"
    print(f"{i:<3} {s['title'][:33]:<35} {s['participantCount']:<10} {s['questCount']:<8} {s['rewardType']:<20} {s['durationDays']}일")

print()
print("인사이트:")
best = max(stats, key=lambda x: x["participantCount"])
print(f"  1. 최다 참여 캠페인: {best['title']} ({best['participantCount']}명)")
avg = sum(s["participantCount"] for s in stats) / 3
print(f"  2. 상위 3개 평균 참여자: {avg:.0f}명")
types = set(s["rewardType"] for s in stats)
print(f"  3. 보상 유형 분포: {', '.join(types)}")
total_prizes = sum(s.get("prizeCount", 0) for s in stats)
print(f"  4. 총 상금 수: {total_prizes}개")
avg_dur = sum(s["durationDays"] for s in stats) / 3
print(f"  5. 평균 캠페인 기간: {avg_dur:.0f}일")

# Step 5: market context
print()
print("[Agent] Step 4: get_oracle_summary() - 시장 컨텍스트 추가")
try:
    oracle = cli_call(["oracle", "summary"])
    kp = oracle.get("kimchiPremium", [])
    if kp:
        latest = kp[-1]
        pct = float(latest["kimchi_premium_pct"])
        print(f"  -> 최신 김치프리미엄: {pct:+.2f}%")
        print(f"  -> BTC 업비트: ${float(latest['upbit_price_usd']):,.0f}")
        print(f"  -> BTC 바이낸스: ${float(latest['binance_price_usd']):,.0f}")
except Exception:
    print("  -> (oracle data unavailable)")

print()
print("=" * 60)
print("  Demo Complete - All data via read-only CLI/MCP tools")
print("=" * 60)
