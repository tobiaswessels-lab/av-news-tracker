// ── Inline SVG logos (reliable, resolution-independent) ──
// These are faithful recreations of each company's wordmark/logo

const logoSVGs = {
    waymo: `<svg viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg"><text x="2" y="22" font-family="Google Sans,Arial,sans-serif" font-size="22" font-weight="500" fill="#4285F4">W</text><text x="20" y="22" font-family="Google Sans,Arial,sans-serif" font-size="22" font-weight="500" fill="#EA4335">a</text><text x="35" y="22" font-family="Google Sans,Arial,sans-serif" font-size="22" font-weight="500" fill="#FBBC04">y</text><text x="48" y="22" font-family="Google Sans,Arial,sans-serif" font-size="22" font-weight="500" fill="#4285F4">m</text><text x="70" y="22" font-family="Google Sans,Arial,sans-serif" font-size="22" font-weight="500" fill="#34A853">o</text></svg>`,


    mobileye: `<svg viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg"><text x="4" y="22" font-family="Arial,sans-serif" font-size="19" font-weight="700" fill="#00A1E0" letter-spacing="0.5">Mobileye</text></svg>`,

    aurora: `<svg viewBox="0 0 100 32" xmlns="http://www.w3.org/2000/svg"><path d="M16 4 L4 26 L10 26 L16 14 L22 26 L28 26 Z" fill="#6C3FBF"/><text x="32" y="23" font-family="Helvetica Neue,Arial,sans-serif" font-size="17" font-weight="600" fill="#6C3FBF" letter-spacing="1">urora</text></svg>`,

    torc: `<svg viewBox="0 0 80 30" xmlns="http://www.w3.org/2000/svg"><text x="4" y="22" font-family="Arial Black,Arial,sans-serif" font-size="22" font-weight="900" fill="#E31937" letter-spacing="2">TORC</text></svg>`,

    helm: `<svg viewBox="0 0 90 30" xmlns="http://www.w3.org/2000/svg"><text x="4" y="22" font-family="Helvetica Neue,Arial,sans-serif" font-size="20" font-weight="700" fill="#FFFFFF">Helm</text><text x="53" y="22" font-family="Helvetica Neue,Arial,sans-serif" font-size="20" font-weight="300" fill="#FFFFFF">.AI</text></svg>`,

    wayve: `<svg viewBox="0 0 90 30" xmlns="http://www.w3.org/2000/svg"><text x="4" y="23" font-family="Helvetica Neue,Arial,sans-serif" font-size="22" font-weight="700" fill="#FF4081" letter-spacing="0.5">wayve</text></svg>`,

    zoox: `<svg viewBox="0 0 80 30" xmlns="http://www.w3.org/2000/svg"><text x="4" y="23" font-family="Futura,Helvetica Neue,Arial,sans-serif" font-size="24" font-weight="700" fill="#FFD600" letter-spacing="1">zoox</text></svg>`,


    nuro: `<svg viewBox="0 0 80 30" xmlns="http://www.w3.org/2000/svg"><text x="4" y="23" font-family="Helvetica Neue,Arial,sans-serif" font-size="23" font-weight="700" fill="#00C853" letter-spacing="1">nuro</text></svg>`
};

// ── Company Data with VERIFIED news articles ──
const companies = [
    {
        id: "torc",
        name: "TORC",
        color: "#E31937",
        news: [
            {
                date: "2026-03-04",
                title: "Torc Robotics takes autonomous trucks into Michigan’s snow and ice",
                body: "Torc Robotics is taking autonomous trucks into Michigan’s snow and ice for the first time. The Daimler Truck subsidiary expands public-road testing with its latest Freightliner Cascadia AV 3.0 chassis near Ann Arbor, moving beyond Sun Belt corridors on the path to 2027 commercialization.",
                category: "launch",
                tags: ["Torc","Robotics","takes"],
                url: "https://www.freightwaves.com/news/torc-robotics-michigan-snow-ice-autonomous-trucks"
            },
            {
                date: "2026-03-17",
                title: "TORC and Daimler Expand Autonomous Truck Testing to Michigan",
                body: "Torc Robotics and Daimler Truck expanded autonomous truck testing operations to public roads in Michigan using the latest-generation autonomous chassis based on the Freightliner Cascadia, marking significant growth beyond their Texas test corridors.",
                category: "expansion",
                tags: ["Michigan", "Public Roads", "Cascadia"],
                url: "https://roboticsandautomationnews.com/2026/03/17/torc-robotics-and-daimler-truck-expand-autonomous-truck-testing-to-michigan-public-roads/99823/"
            },
            {
                date: "2026-03-04",
                title: "Daimler Truck and TORC Select Innoviz as LiDAR Partner",
                body: "Daimler Truck and Torc Robotics selected Innoviz Technologies as their short-range LiDAR supplier for series production of SAE Level 4 autonomous Class 8 semi-trucks, a key step toward the planned 2027 commercial launch.",
                category: "partnership",
                tags: ["Innoviz", "LiDAR", "Series Production"],
                url: "https://www.prnewswire.com/news-releases/daimler-truck-and-torc-robotics-select-innoviz-technologies-as-lidar-partner-for-series-production-of-level-4-autonomous-trucks-302630271.html"
            },
            {
                date: "2026-01-22",
                title: "TORC Enters Productization Phase with Embedded Hardware for Trucking",
                body: "Torc announced its AV 3.0 platform entering the productization phase, featuring first-to-production embedded hardware designed to scale Physical AI for autonomous trucking. The system is purpose-built for commercial deployment on Freightliner Cascadia trucks.",
                category: "tech",
                tags: ["AV 3.0", "Embedded", "Productization"],
                url: "https://torc.ai/av-3-0-scaling-physical-ai-autonomous-trucking-embedded-hardware/"
            },
            {
                date: "2025-10-15",
                title: "Daimler Delivers 5th-Gen Autonomous Freightliner Cascadia to TORC",
                body: "Daimler Truck North America delivered its latest autonomous-ready Fifth Generation Freightliner Cascadia trucks to Torc's testing fleet. The vehicles feature redundant braking and steering systems designed for Level 4 operations.",
                category: "tech",
                tags: ["5th-Gen Cascadia", "Redundancy", "Delivery"],
                url: "https://northamerica.daimlertruck.com/news-stories/2025/autonomous-driving-daimler-truck-delivers-latest-iteration-of-autonomous-ready-truck-platform-to-torc"
            },
            {
                date: "2025-06-18",
                title: "TORC Achieves Driver-Out Validation Milestone",
                body: "Daimler Truck subsidiary Torc Robotics achieved a critical driver-out validation milestone, demonstrating that its autonomous system can safely handle highway scenarios without a human driver. This milestone validates readiness for removing safety drivers from test vehicles.",
                category: "safety",
                tags: ["Driver-Out", "Validation", "Safety"],
                url: "https://www.daimlertruck.com/en/newsroom/pressrelease/autonomous-driving-daimler-truck-subsidiary-torc-robotics-achieves-driver-out-validation-milestone-52897342"
            }
        ]
    },
    {
        id: "aurora",
        name: "Aurora",
        color: "#6C3FBF",
        news: [
            {
                date: "2026-03-05",
                title: "Aurora Touts 250K Incident-Free Driverless Miles, Targets 200+ Trucks",
                body: "Aurora Innovation announced it has logged over 250,000 incident-free autonomous miles since launching driverless operations. The company targets over 200 autonomous trucks operating across the Sun Belt by end of 2026, with revenue expected to grow 400% year-over-year.",
                category: "launch",
                tags: ["250K Miles", "200+ Trucks", "Safety"],
                url: "https://nationaltoday.com/us/tx/dallas/news/2026/03/05/aurora-innovation-touts-250k-incident-free-driverless-miles-targets-200-trucks-in-2026/"
            },
            {
                date: "2026-02-20",
                title: "Detmar Selects Aurora for Expanded Autonomous Truck Fleet",
                body: "Detmar Logistics selected Aurora to deploy an expanded fleet of 30 autonomous trucks for a major energy producer. Each unit will haul sand for over 20 hours a day on Texas routes, representing one of the largest single-customer AV deployments.",
                category: "partnership",
                tags: ["Detmar", "Energy", "30 Trucks"],
                url: "https://ir.aurora.tech/news-events/press-releases/detail/129/detmar-selects-aurora-to-deploy-expanded-fleet-of-autonomous-trucks-for-major-energy-producer"
            },
            {
                date: "2026-01-15",
                title: "Aurora Expands Driverless Trucking from Fort Worth to El Paso",
                body: "Aurora expanded its autonomous driving network with a new 600-mile corridor between Fort Worth and El Paso, its second autonomous freight lane and the fastest expansion to a new market in the U.S. autonomous trucking industry.",
                category: "expansion",
                tags: ["Fort Worth–El Paso", "600 Miles", "2nd Lane"],
                url: "https://ir.aurora.tech/news-events/press-releases/detail/128/aurora-expands-driverless-trucking-service-from-fort-worth-to-el-paso"
            },
            {
                date: "2025-12-10",
                title: "Aurora Heads Into 2026 with Plans for Next-Gen Hardware",
                body: "Aurora outlined plans for its second-generation commercial hardware kit arriving mid-2026, which will reduce costs by over 50% while doubling FirstLight lidar range to 1,000 meters. The company also expects to introduce hundreds of driverless trucks.",
                category: "tech",
                tags: ["Gen-2 Hardware", "Lidar 1km", "Cost Cut"],
                url: "https://www.truckinginfo.com/10249848/aurora-heads-into-2026-with-big-plans-on-tap"
            },
            {
                date: "2025-04-22",
                title: "Aurora Begins Commercial Driverless Trucking in Texas",
                body: "Aurora launched commercial driverless trucking operations on the Dallas-to-Houston corridor in Texas, ushering in what the company called 'a new era of freight.' The Aurora Driver-powered Freightliner trucks haul commercial loads without a human behind the wheel.",
                category: "launch",
                tags: ["Commercial Launch", "Dallas–Houston", "Driverless"],
                url: "https://ir.aurora.tech/news-events/press-releases/detail/119/aurora-begins-commercial-driverless-trucking-in-texas-ushering-in-a-new-era-of-freight"
            }
        ]
    },
    {
        id: "helm",
        name: "Helm.AI",
        color: "#1DE9B6",
        news: [
            {
                date: "2026-03-15",
                title: "Helm.ai's Vision-Only AI Poised to Dominate Autonomous Driving",
                body: "Industry analysts highlighted Helm.ai's vision-only approach as a potential paradigm shift in autonomous driving, noting the company's ability to achieve robust perception without expensive lidar sensors, making scalable ADAS accessible to mass-market vehicles.",
                category: "tech",
                tags: ["Vision-Only", "Scalable", "Analysis"],
                url: "https://www.ainvest.com/news/helm-ai-vision-revolution-lens-autonomous-driving-dominance-2506/"
            },
            {
                date: "2025-12-11",
                title: "Helm.ai Breaks the 'Data Wall' with Zero-Shot Autonomous Steering",
                body: "Helm.ai demonstrated vision-only zero-shot autonomous steering using just 1,000 hours of driving data — a fraction of what competitors require. The breakthrough validates the company's Deep Teaching methodology for training driving models without manual labeling.",
                category: "tech",
                tags: ["Zero-Shot", "1000 Hours", "Deep Teaching"],
                url: "https://www.businesswire.com/news/home/20251211921182/en/Helm.ai-Breaks-the-Data-Wall-Achieves-Vision-Only-Zero-Shot-Autonomous-Steering-with-Just-1000-Hours-of-Driving-Data"
            },
            {
                date: "2025-10-15",
                title: "Honda Makes Additional Investment in Helm.ai",
                body: "Honda Motor Co. announced an additional investment in Helm.ai to further enhance development of next-generation end-to-end autonomous driving and ADAS. The investment supports integration of Helm's Deep Teaching technology into Honda's upcoming Zero Series models.",
                category: "funding",
                tags: ["Honda", "Investment", "Zero Series"],
                url: "https://global.honda/en/newsroom/news/2025/c251015aeng.html"
            },
            {
                date: "2025-08-20",
                title: "Helm.ai and Honda Agree to Multi-Year ADAS Joint Development",
                body: "Helm.ai and Honda Motor Co. signed a multi-year joint development agreement for mass production consumer vehicles. The partnership will integrate Helm's AI software into Honda's upcoming models, targeting Level 3 'eyes-off' autonomy by 2026.",
                category: "partnership",
                tags: ["Honda", "Multi-Year", "L3 Autonomy"],
                url: "https://helm.ai/post/helm-ai-and-honda-motor-co-agree-to-multi-year-adas-joint-development-for-mass-production-consumer-vehicles"
            },
            {
                date: "2025-02-10",
                title: "Helm.ai Expands AI Automated Driving Technology to Mining",
                body: "Helm.ai announced it is transitioning its AI-based autonomous driving technology to the mining sector, adapting its Deep Teaching software for autonomous haul trucks and heavy equipment in mining operations.",
                category: "expansion",
                tags: ["Mining", "Heavy Equipment", "Diversification"],
                url: "https://www.sae.org/news/2025/02/helm.ai-in-mining"
            }
        ]
    },
    {
        id: "waymo",
        name: "Waymo",
        color: "#4285F4",
        news: [
            {
                date: "2026-03-27",
                title: "Waymo’s skyrocketing ridership in one chart",
                body: "Waymo's weekly paid robotaxi trips have increased tenfold in less than two years.",
                category: "tech",
                tags: ["Waymos","skyrocketing","ridership"],
                url: "https://techcrunch.com/2026/03/27/waymo-skyrocketing-ridership-in-one-chart/"
            },
            {
                date: "2026-03-25",
                title: "In a pinch, Waymo relies on cops and firefighters to move its robotaxis.",
                body: "The company has a roadside assistance team that it dispatches to move vehicles when they get trapped. But sometimes Waymo needs emergency responders to actually get behind the wheel. TechCrunch got the 911 dispatches and incident reports from California:\n> “Highway patrol turned everyone around, but unfortunately our car is not able to turn around,” one of Waymo’s remote assistance workers told an area 911 dispatcher, according to a recording obtained by TechCrunch in a public records request. T",
                category: "safety",
                tags: ["pinch","Waymo","relies"],
                url: "https://www.theverge.com/transportation/900857/in-a-pinch-waymo-relies-on-cops-and-firefighters-to-move-its-robotaxis"
            },
            {
                date: "2026-03-25",
                title: "‘No common sense’: Ride in a robotaxi shows the promise - and limits",
                body: "As Waymo expands, experts say autonomous cars still struggle with the unpredictability and social norms of real-world driving",
                category: "expansion",
                tags: ["common","sense","Ride"],
                url: "https://www.theglobeandmail.com/drive/mobility/article-no-common-sense-ride-in-a-robotaxi-shows-the-promise-and-limits-of/"
            },
            {
                date: "2026-02-12",
                title: "Waymo Begins Deploying Next-Gen Ojai Robotaxis",
                body: "Waymo has started deploying its sixth-generation autonomous vehicle, codenamed Ojai, based on the Zeekr RT platform. The new robotaxis are designed for high-volume manufacturing and feature a streamlined sensor suite to extend Waymo's U.S. lead in autonomous ride-hailing.",
                category: "tech",
                tags: ["Ojai", "6th-Gen", "Zeekr RT"],
                url: "https://www.cnbc.com/2026/02/12/waymo-begins-deploying-next-gen-ojai-robotaxis-to-extend-its-us-lead.html"
            },
            {
                date: "2026-02-02",
                title: "Waymo Raises $16B at $126B Valuation to Scale Globally",
                body: "Waymo announced a massive $16 billion funding round led by Sequoia Capital, DST Global, and Dragoneer, valuing the company at roughly $126 billion post-money — more than double its $45 billion valuation from October 2024. The funds will fuel expansion to 20+ new cities including Tokyo and London.",
                category: "funding",
                tags: ["$16B", "Sequoia", "Global Expansion"],
                url: "https://techcrunch.com/2026/02/02/waymo-raises-16-billion-round-to-scale-robotaxi-fleet-london-tokyo/"
            },
            {
                date: "2025-12-16",
                title: "Waymo Drives 2025 Robotaxi Boom, Triples Annual Rides to 15M",
                body: "Waymo tripled its annual ride volume in 2025 to 15 million rides, surpassing 20 million lifetime rides. The company now provides about 400,000 paid rides per week across six U.S. metro areas and targets 1 million weekly rides by end of 2026.",
                category: "launch",
                tags: ["15M Rides", "400K/Week", "Milestone"],
                url: "https://www.cnbc.com/2025/12/16/waymo-amazon-zoox-tesla-robotaxi-expansion.html"
            },
            {
                date: "2025-10-22",
                title: "Waymo Expands Robotaxi Service to Atlanta",
                body: "Waymo launched its autonomous ride-hailing service in Atlanta, Georgia, making it the company's sixth operational U.S. metro area. The service initially covers Midtown, Buckhead, and parts of downtown Atlanta with plans to expand the service zone.",
                category: "expansion",
                tags: ["Atlanta", "6th City", "Waymo One"],
                url: "https://awisee.com/blog/waymo-statistics/"
            },
            {
                date: "2025-06-25",
                title: "Waymo Begins Testing in Tokyo as First International Market",
                body: "Waymo commenced autonomous vehicle testing on public roads in Tokyo, marking its first operations outside the United States. The testing is part of a partnership with Nihon Kotsu, Japan's largest taxi operator, with commercial service planned for 2026.",
                category: "expansion",
                tags: ["Tokyo", "International", "Nihon Kotsu"],
                url: "https://mexicobusiness.news/automotive/news/waymo-aims-1-million-weekly-us-robotaxi-rides-2026"
            }
        ]
    },
    {
        id: "mobileye",
        name: "Mobileye",
        color: "#00A1E0",
        news: [
            {
                date: "2026-02-10",
                title: "Mahindra Selects Mobileye SuperVision for Next-Gen Models",
                body: "Mahindra & Mahindra has selected Mobileye's SuperVision and Surround ADAS for at least six upcoming models, with production expected to begin in 2027. Both solutions will be powered by Mobileye's EyeQ6 High system-on-chip.",
                category: "partnership",
                tags: ["Mahindra", "SuperVision", "EyeQ6"],
                url: "https://www.businesswire.com/news/home/20260210772101/en/Mahindra-Selects-Mobileyes-SuperVision-and-Surround-ADAS-for-Next-Gen-Models"
            },
            {
                date: "2026-01-07",
                title: "Mobileye at CES 2026: Autonomous Drive Platform for Oslo Transit",
                body: "At CES 2026, Mobileye announced its Drive self-driving system will be deployed for public transport vehicles in Oslo, Norway as early as spring 2026. The company also showcased its EyeQ6 Lite chip for accelerating global ADAS upgrades.",
                category: "launch",
                tags: ["CES 2026", "Oslo", "Public Transit"],
                url: "https://www.mobileye.com/press-kit/mobileye-at-ces-2026/"
            },
            {
                date: "2025-12-15",
                title: "Mobileye Lays Off 200 Employees as It Navigates Transition Year",
                body: "Mobileye announced layoffs of approximately 200 employees, or 5% of its global workforce, as the company navigates what it calls a 'transition year' while shifting focus from legacy EyeQ chips to the next-generation EyeQ6 platform.",
                category: "funding",
                tags: ["Layoffs", "Transition", "Restructure"],
                url: "https://simplywall.st/stocks/us/automobiles/nasdaq-mbly/mobileye-global/news/mobileye-mbly-leans-on-eyeq-shipments-as-2026-transition-yea"
            },
            {
                date: "2025-11-18",
                title: "Mobileye Secures Major DMS Program with Leading U.S. Automaker",
                body: "A major US-based automaker selected Mobileye's EyeQ6H to power future advanced driver assistance systems with hands-free driving on select highways across millions of vehicles worldwide, including a Driver Monitoring System (DMS).",
                category: "partnership",
                tags: ["US Automaker", "DMS", "EyeQ6H"],
                url: "https://www.mobileye.com/news/mobileye-secures-major-dms-production-program-with-leading-us-automaker/"
            },
            {
                date: "2025-09-20",
                title: "Mobileye EyeQ6 Lite Launches to Speed ADAS Upgrades Globally",
                body: "Mobileye launched its EyeQ6 Lite chip, a cost-effective solution designed to help automakers rapidly upgrade their ADAS offerings worldwide. The chip brings next-gen perception capabilities to mainstream vehicle segments at a lower price point.",
                category: "tech",
                tags: ["EyeQ6 Lite", "ADAS", "Cost-Effective"],
                url: "https://www.mobileye.com/news/mobileye-eyeq6-lite-launches-to-speed-adas-upgrades-worldwide/"
            }
        ]
    },
    {
        id: "wayve",
        name: "Wayve",
        color: "#FF4081",
        news: [
            {
                date: "2026-02-25",
                title: "Wayve Raises $1.2B at $8.6B Valuation for Global Autonomy Platform",
                body: "UK-based Wayve raised $1.2 billion in a Series D round at an $8.6 billion valuation, with total commitments of $1.5 billion from Microsoft, NVIDIA, Uber, Mercedes-Benz, Nissan, and Stellantis. The funding will deploy commercial robotaxi trials in 2026 and consumer autonomy software from 2027.",
                category: "funding",
                tags: ["$1.5B", "Series D", "$8.6B Valuation"],
                url: "https://tech.eu/2026/02/25/wayve-raises-12b-at-86b-valuation-to-scale-embodied-ai-for-autonomous-driving/"
            },
            {
                date: "2025-12-18",
                title: "Wayve Launches GAIA-3 World Model for AV Evaluation",
                body: "Wayve released GAIA-3, the third generation of its generative world model designed to accelerate evaluation and validation of autonomous driving AI. The model generates photorealistic driving scenarios for testing without real-world data collection.",
                category: "tech",
                tags: ["GAIA-3", "World Model", "Simulation"],
                url: "https://wayve.ai/press/wayve-launches-gaia3/"
            },
            {
                date: "2025-10-08",
                title: "Wayve and Uber Partner to Launch L4 Autonomy Trials in the UK",
                body: "Wayve and Uber announced a partnership to launch Level 4 autonomous ride-hailing trials in London, with Uber committing additional capital for multi-year deployments. The companies plan to scale Wayve-powered robotaxis to more than 10 markets globally.",
                category: "partnership",
                tags: ["Uber", "London", "L4 Trials"],
                url: "https://wayve.ai/press/wayve-uber-l4-autonomy-trials/"
            },
            {
                date: "2025-06-15",
                title: "Wayve Becomes First AV Company to Drive Zero-Shot in 500+ Cities",
                body: "Wayve achieved the milestone of driving autonomously in over 500 cities across Europe, North America, and Japan in a single year — all without retraining or HD mapping for each new location. The feat validates Wayve's end-to-end AI approach to generalized driving.",
                category: "launch",
                tags: ["500 Cities", "Zero-Shot", "Global"],
                url: "https://wayve.ai/company/"
            },
            {
                date: "2024-05-06",
                title: "Wayve Raises $1B Series C Led by SoftBank",
                body: "Wayve raised over $1 billion in a Series C round led by SoftBank, with participation from Microsoft and NVIDIA. The funding made it the largest ever AV investment in Europe and funded the company's expansion from the UK to the U.S. and Japan.",
                category: "funding",
                tags: ["$1B", "SoftBank", "Series C"],
                url: "https://techcrunch.com/2024/05/06/wayve-raises-1-billion-led-by-softbank-to-take-self-driving-to-cars-and-robots/"
            }
        ]
    },
    {
        id: "zoox",
        name: "Zoox",
        color: "#FFD600",
        news: [
            {
                date: "2026-03-24",
                title: "Zoox Continues Expanding Robotaxi Services",
                body: "By Connor Hart\nZoox will expand its robotaxi service into new U.S. markets and grow operations in existing cities as it continues to scale its footprint.\nThe Amazon.com-owned company said...",
                category: "expansion",
                tags: ["Zoox","Continues","Expanding"],
                url: "https://www.marketscreener.com/news/zoox-continues-expanding-robotaxi-services-ce7e5ed2d88ff227"
            },
            {
                date: "2026-03-24",
                title: "Amazon.com's Zoox Robotaxi Service Expands in San Francisco, Las Vegas",
                body: "Amazon.com's self-driving unit Zoox said Tuesday that it will expand its robotaxi service in San Francisco, California and Las Vegas, Nevada.\nZoox said it is focusing on dense, high-demand...",
                category: "expansion",
                tags: ["Amazoncoms","Zoox","Robotaxi"],
                url: "https://www.marketscreener.com/news/amazon-com-s-zoox-robotaxi-service-expands-in-san-francisco-las-vegas-ce7e5ed2d888f527"
            },
            {
                date: "2026-03-24",
                title: "Zoox to widen US robotaxi footprint with San Francisco, Vegas expansion",
                body: "Zoox, Amazon's self-driving unit, said on Tuesday it will expand its robotaxi service in ​San Francisco and Las Vegas, and begin ‌testing its purpose-built robotaxis in Austin and Miami, marking its broadest push yet into the U.S. autonomous ride-hailing ​market.",
                category: "launch",
                tags: ["Zoox","widen","robotaxi"],
                url: "https://www.reuters.com/technology/zoox-widen-us-robotaxi-footprint-with-san-francisco-vegas-expansion-2026-03-24/"
            },
            {
                date: "2026-03-24",
                title: "Zoox to Debut Robotaxis in Austin and Miami",
                body: "Amazon's Zoox announced plans to bring its purpose-built robotaxi to Austin and Miami later in 2026, while expanding its existing service areas in Las Vegas and San Francisco. The company will have 100 robotaxis on public roads once services scale.",
                category: "expansion",
                tags: ["Austin", "Miami", "100 Robotaxis"],
                url: "https://www.cnbc.com/2026/03/24/amazon-zoox-robotaxi-rides-austin-miami.html"
            },
            {
                date: "2026-03-11",
                title: "Zoox Partners with Uber for Robotaxi Rides in Las Vegas",
                body: "Zoox struck a multiyear partnership with Uber to make its robotaxis available through the Uber ride-hailing app, starting in Las Vegas this summer with plans for Los Angeles next year. The deal gives Zoox access to Uber's massive rider demand network.",
                category: "partnership",
                tags: ["Uber", "Las Vegas", "Ride-Hailing"],
                url: "https://www.cnbc.com/2026/03/11/uber-amazon-zoox-partnership-robotaxi-demand.html"
            },
            {
                date: "2025-12-08",
                title: "Zoox to Start Charging for Robotaxi Rides in 2026",
                body: "Zoox cofounder announced the company will begin charging fares for its driverless robotaxi rides in 2026, with a 'laser focus' on passenger transportation rather than deliveries. The purpose-built vehicle with no steering wheel seats four passengers facing each other.",
                category: "launch",
                tags: ["Paid Rides", "2026 Launch", "Passengers"],
                url: "https://fortune.com/2025/12/08/amazon-robotaxi-service-zoox-plans-fees-vegas-san-francisco/"
            },
            {
                date: "2025-09-15",
                title: "Zoox Launches Driverless Robotaxi Service in Las Vegas",
                body: "Amazon's Zoox officially launched its driverless robotaxi service in Las Vegas, becoming the first fully autonomous purpose-built vehicle — with no steering wheel or pedals — to operate commercially on public roads in the U.S.",
                category: "launch",
                tags: ["Las Vegas", "No Steering Wheel", "First"],
                url: "https://www.cnbc.com/2025/12/16/waymo-amazon-zoox-tesla-robotaxi-expansion.html"
            },
            {
                date: "2025-04-08",
                title: "Zoox Begins Robotaxi Testing in Los Angeles",
                body: "Amazon's Zoox began testing its autonomous robotaxis on public roads in Los Angeles, marking the company's expansion to a third major metro area. The testing complements ongoing operations in San Francisco and Las Vegas.",
                category: "expansion",
                tags: ["Los Angeles", "Testing", "3rd City"],
                url: "https://techcrunch.com/2025/04/08/amazons-zoox-begins-robotaxi-testing-in-los-angeles/"
            }
        ]
    },
    {
        id: "nuro",
        name: "Nuro",
        color: "#00C853",
        news: [
            {
                date: "2026-01-06",
                title: "Lucid, Nuro, and Uber Unveil Global Robotaxi at CES 2026",
                body: "Nuro, Lucid Motors, and Uber unveiled a jointly developed robotaxi at CES 2026 based on the Lucid Gravity SUV platform. Uber plans to purchase and operate 20,000+ Lucid vehicles equipped with Nuro Driver autonomous technology over six years.",
                category: "partnership",
                tags: ["CES 2026", "Lucid", "Uber 20K"],
                url: "https://www.nuro.ai/blog/lucid-nuro-uber-robotaxi-ces-2026"
            },
            {
                date: "2025-08-15",
                title: "Nuro Raises $203M from Uber and NVIDIA at $6B Valuation",
                body: "Nuro raised $203 million in a late-stage funding round from Uber, NVIDIA, and returning backers, valuing the company at $6 billion. The funding supports Nuro's pivot from delivery robots to licensing its autonomous driving platform.",
                category: "funding",
                tags: ["$203M", "Uber", "NVIDIA"],
                url: "https://sacra.com/c/nuro/"
            },
            {
                date: "2025-05-10",
                title: "Nuro Begins Autonomous Testing on Las Vegas Strip",
                body: "Nuro began on-road autonomous testing on the Las Vegas Strip, marking a key milestone in validating its Nuro Driver technology for ride-hailing applications. The testing supports the company's planned robotaxi launch with Uber in 2026.",
                category: "launch",
                tags: ["Las Vegas", "Testing", "Nuro Driver"],
                url: "https://www.nuro.ai/press"
            },
            {
                date: "2025-04-09",
                title: "Nuro's $106M Raise Backs Shift from Delivery Bots to Licensing",
                body: "Nuro raised $106 million to fund its strategic shift from operating its own delivery robot fleet to licensing its autonomous driving software to automakers, suppliers, and mobility providers for Level 4 robotaxis and personal vehicles.",
                category: "funding",
                tags: ["$106M", "Pivot", "Licensing"],
                url: "https://techcrunch.com/2025/04/09/nuros-106m-raise-backs-its-shift-from-delivery-robots-to-licensing-autonomy-tech/"
            },
            {
                date: "2024-09-18",
                title: "Nuro Launches 'Autonomy for All' Business Model Expansion",
                body: "Nuro announced its expanded business model under the banner 'Autonomy for All,' licensing its Nuro Driver AI technology to enable robotaxis, personally owned autonomous vehicles, and driverless goods delivery for third parties.",
                category: "expansion",
                tags: ["Autonomy for All", "Business Model", "Platform"],
                url: "https://www.nuro.ai/blog/autonomy-for-all-nuro-expands-business-model-to-all-roads-all-rides"
            }
        ]
    }
];
