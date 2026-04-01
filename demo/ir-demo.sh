#!/bin/bash
# 3ridge Agent-Native CLI — IR Demo Script
# Demonstrates how an AI agent accesses 3ridge data via CLI/MCP
set -e

CLI="node $(dirname "$0")/../dist/bin/3ridge.js"

echo "=================================================="
echo "  3ridge Agent-Native Data Infrastructure Demo"
echo "=================================================="
echo ""

# --- Scenario 1: Campaign Overview ---
echo ">> Scenario 1: Agent queries active campaigns"
echo "   User: '현재 진행 중인 3ridge 캠페인 현황을 보여줘'"
echo ""
echo "   Agent calls: list_campaigns(visible_only=true)"
echo ""
$CLI --format table campaigns list --visible 2>/dev/null | head -20
echo ""

# --- Scenario 2: Campaign Deep Dive ---
echo ">> Scenario 2: Agent analyzes a specific campaign"
echo "   User: '가장 최근 캠페인의 통계를 분석해줘'"
echo ""

# Get the first visible campaign ID
CAMPAIGN_ID=$($CLI campaigns list --visible 2>/dev/null | python3 -c "import sys,json; print(json.load(sys.stdin)[0]['id'])")
CAMPAIGN_TITLE=$($CLI campaigns list --visible 2>/dev/null | python3 -c "import sys,json; print(json.load(sys.stdin)[0]['title'])")

echo "   Agent calls: get_campaign_stats('$CAMPAIGN_ID')"
echo ""
$CLI --format table campaigns stats "$CAMPAIGN_ID" 2>/dev/null
echo ""

echo "   Agent calls: get_rewards_summary('$CAMPAIGN_ID')"
echo ""
$CLI rewards summary "$CAMPAIGN_ID" 2>/dev/null
echo ""

echo "   Agent calls: list_quests('$CAMPAIGN_ID')"
echo ""
$CLI --format table quests list "$CAMPAIGN_ID" 2>/dev/null
echo ""

# --- Scenario 3: Cross-Data Analysis ---
echo ">> Scenario 3: Agent cross-references leaderboard + mindshare"
echo "   User: '리더보드 상위 프로젝트와 마인드쉐어 데이터를 비교해줘'"
echo ""
echo "   Agent calls: get_leaderboard_list()"
echo ""
$CLI leaderboard list 2>/dev/null | python3 -c "
import sys,json
data = json.load(sys.stdin)
public = [x for x in data if x.get('isPublic')]
print(f'   Found {len(data)} leaderboards ({len(public)} public)')
for lb in public[:3]:
    print(f'     - {lb[\"name\"]} (id={lb[\"id\"]})')
"
echo ""

echo "   Agent calls: get_mindshare()"
echo ""
$CLI mindshare community 2>/dev/null | python3 -c "
import sys,json
data = json.load(sys.stdin)
items = data.get('items', [])
print(f'   Community mindshare: {len(items)} projects tracked')
for item in items[:5]:
    name = item.get('name', 'unknown')
    share = item.get('mindshare', item.get('share', 'N/A'))
    print(f'     - {name}: {share}')
" 2>/dev/null || echo "   (mindshare data structure varies)"

echo ""

# --- Scenario 4: Market Oracle ---
echo ">> Scenario 4: Agent provides market context"
echo "   User: '김치프리미엄 최근 추이는?'"
echo ""
echo "   Agent calls: get_oracle_summary()"
echo ""
$CLI oracle summary 2>/dev/null | python3 -c "
import sys,json
data = json.load(sys.stdin)
kp = data.get('kimchiPremium', [])
if kp:
    latest = kp[-1]
    print(f'   Latest kimchi premium: {float(latest[\"kimchi_premium_pct\"]):.2f}%')
    print(f'   Upbit BTC: \${float(latest[\"upbit_price_usd\"]):,.0f}')
    print(f'   Binance BTC: \${float(latest[\"binance_price_usd\"]):,.0f}')
    print(f'   Date: {latest[\"candle_time\"][:10]}')
"
echo ""

echo "=================================================="
echo "  Demo Complete"
echo "  All data retrieved via read-only CLI/MCP tools"
echo "  No backend modifications required"
echo "=================================================="
