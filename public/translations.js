const translations = {
    "en": {
        // Sidebar
        "menu_dashboard": "Dashboard",
        "menu_evidence": "Evidence Locker",
        "menu_chat": "AI Chat",
        "menu_config": "Configuration",
        "system_status": "System Status",
        "status_online": "Online",
        "status_offline": "Offline",

        // Dashboard (index.html)
        "dash_title": "Live Surveillance",
        "dash_subtitle": "Real-time surveillance & intelligence platform",
        "btn_start": "Start Surveillance",
        "btn_stop": "Stop Surveillance",
        "metric_evidence": "Evidence Found",
        "metric_evidence_desc": "Potential threats detected",
        "metric_hits": "Active Keyword Hits",
        "metric_hits_desc": "Matches in last session",
        "metric_uptime": "System Uptime",
        "metric_uptime_desc": "Total active running time for current session",
        "filter_title": "Target Filters",
        "filter_desc": "Select rooms to display logs",
        "filter_public": "Public Rooms",
        "filter_private": "Private Rooms",
        "log_title": "Live Operations Log",
        "log_desc": "Real-time feed",
        "log_waiting": "Waiting for logs...",
        "sys_active": "System Active",
        "sys_offline": "System Offline",

        // Configuration (config.html)
        "config_title": "System Configuration",
        "discovery_title": "Discovery & Access",
        "tab_discovery_public": "Public Room Search",
        "tab_discovery_private": "Private Room Search",
        "label_search": "Search Public Channels",
        "placeholder_search": "Topic (e.g. 'Crypto', 'News')",
        "btn_search": "Search",
        "label_manual": "Manual Access (Join via Link)",
        "hint_manual": "Supports private invites, hashes, and usernames.",
        "btn_join": "Join",
        "global_settings": "Global Settings",
        "tab_general": "General & AI",
        "tab_targets": "Target Settings",
        "tab_private": "Private Room Settings",
        "label_persona": "AI Persona (System Prompt)",
        "opt_select_persona": "-- Select a Persona --",
        "placeholder_persona_name": "Persona Name...",
        "btn_save_persona": "Save Selection",
        "alert_enter_persona_name": "Please enter a name for the persona.",
        "alert_enter_persona_prompt": "Persona prompt cannot be empty.",
        "confirm_delete_persona": "Delete persona: ",
        "placeholder_persona": "You are a digital forensics analyst...",
        "label_provider": "AI Provider",
        "label_api_key": "Groq API Key",
        "label_targets": "Target Channels",
        "hint_targets": "These targets are monitored by the system.",
        "crawler_mode": "Crawler Mode",
        "hint_crawler": "Auto-discover & join related channels.",
        "label_keywords": "Suspicious Keywords",
        "placeholder_keyword": "Add a keyword...",
        "hint_keywords": "Comma separated list of triggers.",
        "label_monitoring_retention": "Monitoring Dashboard Retention",
        "opt_100": "100 logs",
        "opt_200": "200 logs",
        "opt_500": "500 logs",
        "opt_unlimited": "Unlimited (All logs)",
        "label_history": "History Limit",
        "label_risk": "Risk Threshold",
        "btn_save": "Save Configuration",
        "process_log": "Process Log",
        "process_control": "Process Control",
        "btn_stop_process": "Stop Process",
        "hint_stop": "Halts all active scraping and monitoring tasks immediately.",
        "active_targets_title": "Active Targets",
        "active_targets_desc": "Currently monitored channels",
        "active_targets_public": "Public Targets",

        "active_targets_private": "Private Targets",
        "btn_add": "Add",
        "sort_name": "Name (A-Z)",
        "sort_members": "Members",
        "sort_activity": "Activity",
        "no_targets_public": "No public targets.<br>Add one via Search!",
        "no_targets_private": "No private targets.<br>Add one via Manual Join!",
        "placeholder_search_results": "Enter topic to find channels...",
        "confirm_stop": "Stop all processes?",
        "alert_stopped": "Stopped.",
        "alert_added": "Added",
        "confirm_generate_report": "Generate report for",
        "alert_report_created": "Report generated",
        "confirm_delete_report": "Delete this report?",
        "alert_report_deleted": "Report deleted.",
        "confirm_remove": "Remove target?",
        "reports_archive": "Reports Archive",
        "report_viewer_title": "Report Viewer",
        "btn_close": "Close",
        "msg_loading": "Loading...",
        "msg_error_loading": "Error loading file.",
        "msg_error_loading": "Error loading file.",
        "msg_no_results": "No results found.",
        "alert_saved": "Configuration Saved!",
        "btn_add": "Add",
        "sort_name": "Name (A-Z)",
        "sort_members": "Members",
        "sort_activity": "Activity",
        "no_targets_public": "No public targets.<br>Add one via Search!",
        "no_targets_private": "No private targets.<br>Add one via Manual Join!",

        // Chat (chat.html)
        "chat_title": "Live Forensic Assistant",
        "chat_model": "Model",
        "chat_welcome": "<strong>System Ready.</strong><br>I am your forensic analysis assistant. I can parse patterns, analyze user intent, and help correlate evidence from the Telegram data.<br><br><em>Try asking: \"Analyze the last 5 messages from @target_channel\"</em>",
        "typing_indicator": "AI is analyzing...",
        "placeholder_chat": "Enter query or command...",
        "investigation_mode": "Investigation Mode",
        "deep_search": "Deep Search (RAG)",
        "deep_search_desc": "Enables vector database search to find relevant context from historical chats before answering.",
        "suggested_actions": "Suggested Actions",
        "action_summarize": "📝 Summarize Evidence",
        "action_top_users": "👥 Top Users Analysis",
        "action_keyword": "💊 Keyword Audit",

        // Evidence (evidence.html)
        "evidence_title": "Evidence Locker",
        "evidence_subtitle": "Archived intelligence & flagged communications",
        "btn_refresh": "Refresh Database",
        "th_time": "Time Logged",
        "th_risk": "Risk Profile",
        "th_sender": "Source User",
        "th_source": "Source Thread",
        "th_summary": "Intelligence Summary",
        "th_message": "Exact Message",
        "th_indicators": "Indicators",
        "msg_accessing": "Accessing secure records...",
        "msg_syncing": "Syncing...",
        "msg_no_evidence": "No flagged evidence found in database.",
        "msg_db_error": "Database Connection Failed: ",
        "risk_low": "LOW",
        "risk_medium": "MEDIUM",
        "risk_high": "HIGH",
        "sort_date_desc": "Date (Newest)",
        "sort_date_asc": "Date (Oldest)",
        "sort_channel_asc": "Channel Name (A-Z)",
        "sort_channel_desc": "Channel Name (Z-A)",
        "sort_risk_desc": "Risk Profile (High to Low)",
        "sort_risk_asc": "Risk Profile (Low to High)",
        "th_actions": "Actions",
        "confirm_remove_evidence": "Are you sure you want to permanently delete this evidence from the database?",
        "alert_evidence_removed": "Evidence removed successfully."
    },
    "ko": {
        // Sidebar
        "menu_dashboard": "모니터링",
        "menu_evidence": "증거 보관소",
        "menu_chat": "AI 분석 채팅",
        "menu_config": "설정",
        "system_status": "시스템 상태",
        "status_online": "온라인",
        "status_offline": "오프라인",

        // Dashboard (index.html)
        "dash_title": "실시간 모니터링",
        "dash_subtitle": "실시간 모니터링 및 인텔리전스 플랫폼",
        "btn_start": "시작",
        "btn_stop": "감시 중지",
        "metric_evidence": "탐지된 증거",
        "metric_evidence_desc": "잠재적 위협 감지됨",
        "metric_hits": "키워드 탐지",
        "metric_hits_desc": "현재 세션 매칭 건수",
        "metric_uptime": "가동 시간",
        "metric_uptime_desc": "현재 세션 총 실행 시간",
        "filter_title": "채널 필터",
        "filter_desc": "표시할 로그 선택",
        "filter_public": "공개방",
        "filter_private": "비공개방",
        "log_title": "실시간 작업 로그",
        "log_desc": "실시간 피드",
        "log_waiting": "로그 대기 중...",
        "sys_active": "시스템 가동 중",
        "sys_offline": "시스템 오프라인",

        // Configuration (config.html)
        "config_title": "시스템 설정",
        "discovery_title": "채널 탐색 및 접속",
        "tab_discovery_public": "공개방 검색",
        "tab_discovery_private": "비공개방 검색",
        "label_search": "공개 채널 검색",
        "placeholder_search": "주제 (예: '코인', '뉴스')",
        "btn_search": "검색",
        "label_manual": "수동 접속 (링크)",
        "hint_manual": "비공개 초대 링크, 해시, 사용자명 지원.",
        "btn_join": "접속",
        "global_settings": "전체 설정",
        "tab_general": "일반 및 AI",
        "tab_targets": "공개방 설정",
        "tab_private": "비공개방 설정",
        "label_persona": "AI 페르소나 (시스템 프롬프트)",
        "opt_select_persona": "-- 페르소나 선택 --",
        "placeholder_persona_name": "페르소나 이름...",
        "btn_save_persona": "설정 저장",
        "alert_enter_persona_name": "페르소나 이름을 입력해주세요.",
        "alert_enter_persona_prompt": "페르소나 프롬프트를 입력해야 합니다.",
        "confirm_delete_persona": "다음 페르소나를 삭제하시겠습니까: ",
        "placeholder_persona": "당신은 디지털 포렌식 분석가입니다...",
        "label_provider": "AI 공급자",
        "label_api_key": "Groq API 키",
        "label_targets": "타겟 채널 목록",
        "hint_targets": "시스템에서 모니터링 중인 타겟입니다.",
        "crawler_mode": "크롤러 모드",
        "hint_crawler": "관련 채널 자동 탐색 및 접속.",
        "label_keywords": "의심 키워드",
        "placeholder_keyword": "키워드 추가...",
        "hint_keywords": "탐지할 키워드를 입력하세요.",
        "label_monitoring_retention": "모니터링 로그 보존 수",
        "opt_100": "100개 로그",
        "opt_200": "200개 로그",
        "opt_500": "500개 로그",
        "opt_unlimited": "무제한 (전체)",
        "label_history": "기록 제한",
        "label_risk": "위험 임계값",
        "btn_save": "설정 저장",
        "process_log": "프로세스 로그",
        "process_control": "프로세스 제어",
        "btn_stop_process": "프로세스 중지",
        "hint_stop": "모든 활성 스크래핑 및 모니터링 작업을 즉시 중단합니다.",
        "active_targets_title": "활성 타겟",
        "active_targets_desc": "현재 모니터링 중인 채널",
        "active_targets_public": "공개 타겟",
        "active_targets_private": "비공개 타겟",
        "btn_add": "추가",
        "sort_name": "이름 (가나다)",
        "sort_members": "멤버 수",
        "sort_activity": "활동량",
        "no_targets_public": "공개 타겟이 없습니다.<br>검색을 통해 추가하세요!",
        "no_targets_private": "비공개 타겟이 없습니다.<br>수동 접속으로 추가하세요!",
        "placeholder_search_results": "주제를 입력하여 채널을 검색하세요...",
        "confirm_stop": "모든 프로세스를 중지하시겠습니까?",
        "alert_stopped": "중지되었습니다.",
        "alert_added": "추가됨",
        "confirm_generate_report": "보고서를 생성하시겠습니까 for",
        "alert_report_created": "보고서 생성 완료",
        "confirm_delete_report": "이 보고서를 삭제하시겠습니까?",
        "alert_report_deleted": "보고서가 삭제되었습니다.",
        "confirm_remove": "타겟을 삭제하시겠습니까?",
        "reports_archive": "리포트 내역",
        "report_viewer_title": "보고서 뷰어",
        "btn_close": "닫기",
        "msg_loading": "로딩 중...",
        "msg_error_loading": "파일을 불러오는 중 오류가 발생했습니다.",
        "msg_error_loading": "파일을 불러오는 중 오류가 발생했습니다.",
        "msg_no_results": "검색 결과가 없습니다.",
        "alert_saved": "설정이 저장되었습니다!",

        "btn_add": "추가",
        "sort_name": "이름 (가나다)",
        "sort_members": "멤버 수",
        "sort_activity": "활동량",
        "no_targets_public": "공개 타겟이 없습니다.<br>검색을 통해 추가하세요!",
        "no_targets_private": "비공개 타겟이 없습니다.<br>수동 접속으로 추가하세요!",

        // Chat (chat.html)
        "chat_title": "실시간 포렌식 어시스턴트",
        "chat_model": "모델",
        "chat_welcome": "<strong>시스템 준비 완료.</strong><br>저는 포렌식 분석 어시스턴트입니다. 텔레그램 데이터에서 패턴을 분석하고, 사용자 의도를 파악하며, 증거를 연관 분석하도록 도와드립니다.<br><br><em>예시 질문: \"@target_channel의 최근 메시지 5개를 분석해줘\"</em>",
        "typing_indicator": "AI 분석 중...",
        "placeholder_chat": "질문이나 명령어를 입력하세요...",
        "investigation_mode": "수사 모드",
        "deep_search": "심층 검색 (RAG)",
        "deep_search_desc": "답변하기 전에 벡터 데이터베이스에서 과거 채팅 기록을 검색하여 관련 문맥을 찾습니다.",
        "suggested_actions": "추천 작업",
        "action_summarize": "📝 증거 요약",
        "action_top_users": "👥 상위 사용자 분석",
        "action_keyword": "💊 키워드 감사",

        // Evidence (evidence.html)
        "evidence_title": "증거 보관소",
        "evidence_subtitle": "보관된 인텔리전스 및 식별된 통신",
        "btn_refresh": "데이터베이스 새로고침",
        "th_time": "기록 시간",
        "th_risk": "위험도",
        "th_sender": "작성자",
        "th_source": "출처 스레드",
        "th_summary": "인텔리전스 요약",
        "th_message": "원본 메시지",
        "th_indicators": "식별자",
        "msg_accessing": "보안 기록 접근 중...",
        "msg_syncing": "동기화 중...",
        "msg_no_evidence": "데이터베이스에서 식별된 증거를 찾을 수 없습니다.",
        "msg_db_error": "데이터베이스 연결 실패: ",
        "risk_low": "낮음",
        "risk_medium": "중간",
        "risk_high": "높음",
        "sort_date_desc": "날짜 (최신순)",
        "sort_date_asc": "날짜 (오래된순)",
        "sort_channel_asc": "채널 이름 (A-Z)",
        "sort_channel_desc": "채널 이름 (Z-A)",
        "sort_risk_desc": "위험도 (높은순)",
        "sort_risk_asc": "위험도 (낮은순)",
        "th_actions": "작업",
        "confirm_remove_evidence": "데이터베이스에서 이 증거를 영구적으로 삭제하시겠습니까?",
        "alert_evidence_removed": "증거가 성공적으로 삭제되었습니다."
    }
};

let currentLang = localStorage.getItem('appLang') || 'ko'; // Default to Korean

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('appLang', lang);
    applyTranslations();
    updateLanguageToggle();
}

function applyTranslations() {
    const t = translations[currentLang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                if (el.getAttribute('placeholder')) {
                    el.placeholder = t[key];
                }
            } else {
                el.innerHTML = t[key];
            }
        }
    });

    // Specific logic for dynamic contents or attributes
    document.documentElement.lang = currentLang;
}

function updateLanguageToggle() {
    const toggles = document.querySelectorAll('.lang-toggle');
    toggles.forEach(toggle => {
        if (toggle.dataset.lang === currentLang) {
            toggle.classList.add('active');
        } else {
            toggle.classList.remove('active');
        }
    });
}

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    applyTranslations();
});
