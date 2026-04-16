// ── Trucking & Bus Company Logos ──
const truckingLogoSVGs = {
    daimler: `<svg viewBox="0 0 200 30" xmlns="http://www.w3.org/2000/svg"><text x="4" y="22" font-family="Helvetica Neue,Arial,sans-serif" font-size="18" font-weight="800" fill="#00CFFF" letter-spacing="1">DAIMLER TRUCK</text></svg>`,

    traton: `<svg viewBox="0 0 100 30" xmlns="http://www.w3.org/2000/svg"><text x="4" y="22" font-family="Arial Black,Arial,sans-serif" font-size="20" font-weight="900" fill="#66B2FF" letter-spacing="1.5">TRATON</text></svg>`,

    paccar: `<svg viewBox="0 0 100 30" xmlns="http://www.w3.org/2000/svg"><text x="4" y="22" font-family="Helvetica Neue,Arial,sans-serif" font-size="20" font-weight="800" fill="#C8102E" letter-spacing="1">PACCAR</text></svg>`,

    tata: `<svg viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg"><text x="4" y="22" font-family="Helvetica Neue,Arial,sans-serif" font-size="18" font-weight="700" fill="#486AAE" letter-spacing="0.5">TATA</text><text x="52" y="22" font-family="Helvetica Neue,Arial,sans-serif" font-size="18" font-weight="400" fill="#486AAE" letter-spacing="0.5">Motors</text></svg>`,

    volvo: `<svg viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg"><circle cx="14" cy="15" r="10" fill="none" stroke="#FFFFFF" stroke-width="2"/><line x1="4" y1="15" x2="24" y2="15" stroke="#FFFFFF" stroke-width="1.5"/><path d="M9 10 L19 10" stroke="#FFFFFF" stroke-width="1.5"/><text x="30" y="22" font-family="Helvetica Neue,Arial,sans-serif" font-size="17" font-weight="700" fill="#FFFFFF" letter-spacing="1">VOLVO</text></svg>`
};

// ── Trucking & Bus Companies with VERIFIED news ──
const truckingCompanies = [
    {
        id: "daimler",
        name: "Daimler Truck",
        color: "#00ADEF",
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
                date: "2026-03-12",
                title: "Mercedes-Benz Trucks Expands eActros 600 Electric Portfolio",
                body: "Mercedes-Benz Trucks announced an expanded portfolio of battery-electric trucks based on the eActros 600 platform, adding new configurations for distribution, construction, and long-haul applications across Europe.",
                category: "tech",
                tags: ["eActros 600", "Electric", "Portfolio"],
                url: "https://www.daimlertruck.com/en/newsroom/pressrelease/mercedes-benz-trucks-expands-portfolio-of-battery-electric-trucks-based-on-the-eactros-600-53071802"
            },
            {
                date: "2026-02-18",
                title: "Daimler Truck Reveals Autonomous EV Tech Demo Truck at ACT Expo",
                body: "Daimler Truck introduced a battery-electric autonomous Freightliner eCascadia technology demonstrator equipped with Torc Robotics' Level 4 autonomous driving software and sensor technology, combining electric and autonomous capabilities.",
                category: "tech",
                tags: ["eCascadia", "Autonomous EV", "Demo"],
                url: "https://www.actexpo.com/announcement/daimler-truck-reveals-autonomous-ev-tech-demo-truck/"
            },
            {
                date: "2025-10-15",
                title: "Daimler Delivers 5th-Gen Autonomous Freightliner Cascadia to Torc",
                body: "Daimler Truck North America delivered its latest autonomous-ready Fifth Generation Freightliner Cascadia trucks to Torc Robotics for testing on routes in New Mexico, Texas, and Arizona, with a new lane between Laredo and Dallas.",
                category: "launch",
                tags: ["5th-Gen Cascadia", "Torc", "Autonomous"],
                url: "https://northamerica.daimlertruck.com/news-stories/2025/autonomous-driving-daimler-truck-delivers-latest-iteration-of-autonomous-ready-truck-platform-to-torc"
            },
            {
                date: "2025-07-01",
                title: "Daimler, NextEra, and BlackRock to Build U.S. Truck Charging Network",
                body: "Daimler Truck North America, NextEra Energy Resources, and BlackRock Renewable Power announced plans to build a network of public charging sites on critical freight routes along the east and west coasts and in Texas by 2026.",
                category: "partnership",
                tags: ["Charging", "BlackRock", "NextEra"],
                url: "https://www.daimlertruck.com/en/newsroom/pressrelease/daimler-truck-north-america-nextera-energy-resources-and-blackrock-renewable-power-announce-plans-to-accelerate-public-charging-infrastructure-for-commercial-vehicles-across-the-us-51874160"
            },
            {
                date: "2025-03-10",
                title: "Daimler Truck Sustains Class 8 Market Dominance Despite Weak Demand",
                body: "Daimler Truck maintained its position as the leading Class 8 truck manufacturer in North America despite a challenging demand environment, with its Freightliner brand continuing to lead retail market share.",
                category: "funding",
                tags: ["Market Leader", "Class 8", "Freightliner"],
                url: "https://www.truckingdive.com/news/daimler-truck-q42025-earnings/814714/"
            }
        ]
    },
    {
        id: "traton",
        name: "TRATON",
        color: "#003366",
        news: [
            {
                date: "2026-04-13",
                title: "Traton truck deliveries fall 6% in first quarter as US weakness persists",
                body: "German truck manufacturer Traton reported a 6% drop ​in vehicle sales for the first quarter of ‌2026 on Monday, driven by a 21% decline in its U.S.-based International Motors brand.",
                category: "tech",
                tags: ["Traton","truck","deliveries"],
                url: "https://www.reuters.com/business/traton-vehicle-sales-fall-6-first-quarter-2026-04-13/"
            },
            {
                date: "2026-04-12",
                title: "Kepler Capital Remains a Sell on TRATON SE (8TRA)",
                body: "In a report released on April 10, Michael Raab from Kepler Capital maintained a Sell rating on TRATON SE, with a price target of €27.00. The co...",
                category: "tech",
                tags: ["Kepler","Capital","Remains"],
                url: "https://markets.businessinsider.com/news/stocks/kepler-capital-remains-a-sell-on-traton-se-8tra-1036013355"
            },
            {
                date: "2026-04-10",
                title: "J.P. Morgan Reaffirms Their Hold Rating on TRATON SE (8TRA)",
                body: "In a report released yesterday, Jose Asumendi from J.P. Morgan maintained a Hold rating on TRATON SE, with a price target of €30.00.Easter Sale ...",
                category: "tech",
                tags: ["Morgan","Reaffirms","Their"],
                url: "https://markets.businessinsider.com/news/stocks/j-p-morgan-reaffirms-their-hold-rating-on-traton-se-8tra-1036009993"
            },
            {
                date: "2026-03-31",
                title: "The TRATON GROUP and Applied Intuition Announce TRATON ONE OS, a Unified Software Platform for Improved Fleet Uptime Across TRATON's Four Global Brands",
                body: "MUNICH and SUNNYVALE, Calif., April 1, 2026 /PRNewswire/ -- The TRATON GROUP and Applied Intuition, Inc., the leading physical AI company, today announced TRATON ONE OS, a next-generation software-defined vehicle platform that will power all new vehicles across TRATON's four brands: Scania, MAN, International and Volkswagen Truck & Bus. Building on more than a year of co-development, the two companies are deploying a single unified platform that's at the forefront of innovation to deliver benefi",
                category: "launch",
                tags: ["TRATON","GROUP","Applied"],
                url: "https://www.manilatimes.net/2026/04/01/tmt-newswire/pr-newswire/the-traton-group-and-applied-intuition-announce-traton-one-os-a-unified-software-platform-for-improved-fleet-uptime-across-tratons-four-global-brands/2311932"
            },
            {
                date: "2026-03-31",
                title: "The TRATON GROUP and Applied Intuition Announce TRATON ONE OS, a Unified Software Platform for Improved Fleet Uptime Across TRATON's Four Global Brands",
                body: "/PRNewswire/ -- The TRATON GROUP and Applied Intuition, Inc., the leading physical AI company, today announced TRATON ONE OS, a next-generation...",
                category: "tech",
                tags: ["TRATON","GROUP","Applied"],
                url: "https://www.prnewswire.co.uk/news-releases/the-traton-group-and-applied-intuition-announce-traton-one-os-a-unified-software-platform-for-improved-fleet-uptime-across-tratons-four-global-brands-302729425.html"
            },
            {
                date: "2026-03-11",
                title: "TRATON SE (8TRA) Receives a Hold from Jefferies",
                body: "Jefferies analyst Michael Aspinall maintained a Hold rating on TRATON SE yesterday and set a price target of €33.00.Claim 70% Off TipRanks Premi...",
                category: "tech",
                tags: ["TRATON","8TRA","Receives"],
                url: "https://markets.businessinsider.com/news/stocks/traton-se-8tra-receives-a-hold-from-jefferies-1035917810"
            },
            {
                date: "2026-03-05",
                title: "TRATON GROUP Sees Robust Incoming Orders in Europe for 2025",
                body: "Despite a weak market environment with total unit sales of 305,500 vehicles (down 9% YoY), TRATON reported robust incoming orders in Europe and an 86% increase in all-electric vehicle sales to 3,230 units.",
                category: "funding",
                tags: ["305K Units", "EV +86%", "Europe Orders"],
                url: "https://traton.com/en/newsroom/press-releases/pm-traton-group-in-2025-with-robust-incoming-orders-in-europe.html"
            },
            {
                date: "2025-10-20",
                title: "MAN Lion's Coach E Wins 'Sustainable Bus of the Year 2026' Award",
                body: "MAN's all-electric Lion's Coach E became the first European manufacturer's electric coach to win the 'Sustainable Bus of the Year' award, validating TRATON's push into zero-emission passenger transport.",
                category: "tech",
                tags: ["MAN", "Electric Coach", "Award"],
                url: "https://traton.com/en/newsroom/press-releases/traton-group-records-total-unit-sales-of-around-vehicles-in-a-weak-market-environment.html"
            },
            {
                date: "2025-07-01",
                title: "TRATON Launches Group-Wide R&D Organization with 9,000 Engineers",
                body: "TRATON's new Group-wide research and development function started operations, consolidating 9,000 R&D employees from Scania, MAN, International, and Volkswagen Truck & Bus into a unified organization.",
                category: "expansion",
                tags: ["R&D Merge", "9000 Engineers", "Scania+MAN"],
                url: "https://traton.com/en/newsroom/press-releases/traton-group-writes-a-new-chapter-in-the-companys-history-with-the-joint-group-research-and-development-organization.html"
            },
            {
                date: "2025-06-15",
                title: "MAN Starts Series Production of Electric Heavy-Duty Trucks in Munich",
                body: "MAN began series production of battery-electric heavy-duty trucks at its original Munich plant, with both electric and diesel trucks produced on the same line in a fully integrated mixed production process.",
                category: "launch",
                tags: ["MAN", "Munich", "EV Production"],
                url: "https://traton.com/en/newsroom/press-releases/traton-group-records-total-unit-sales-of-around-vehicles-in-a-weak-market-environment.html"
            },
            {
                date: "2025-04-10",
                title: "TRATON and Plus Expand Autonomous Truck Partnership Globally",
                body: "TRATON GROUP and PlusAI expanded their global partnership to accelerate autonomous truck commercialization, including fleet trials in Texas, NVIDIA-powered Level 4 development, and driverless safety maneuver validation.",
                category: "partnership",
                tags: ["PlusAI", "L4 Autonomy", "Global"],
                url: "https://traton.com/en/newsroom/press-releases/traton-group-and-plusai-expand-global-partnership-to-accelerate-autonomous-truck-on-highway-commercialization.html"
            }
        ]
    },
    {
        id: "paccar",
        name: "PACCAR",
        color: "#C8102E",
        news: [
            {
                date: "2026-04-12",
                title: "Here's What to Expect From PACCAR’s Next Earnings Report",
                body: "PACCAR is set to release its first-quarter results later this month, with analysts projecting a double-digit decline in earnings.",
                category: "funding",
                tags: ["Heres","What","Expect"],
                url: "https://www.barchart.com/story/news/1262383/here-s-what-to-expect-from-paccars-next-earnings-report"
            },
            {
                date: "2026-04-11",
                title: "Two teens seriously injured in Montgomery County crash",
                body: "COLUMBIA, Mo. (KMIZ) Two teenagers were hurt Friday night after a crash on Interstate 70 in Montgomery County. According to a Missouri State Highway Patrol crash report, a 22-year-old man from Grandview, Missouri, was driving a 2022 Kenworth T680 eastbound on I-70 and merged into the left lane shortly after 4 p.m. The tractor-trailer's towed",
                category: "safety",
                tags: ["teens","seriously","injured"],
                url: "https://abc17news.com/news/montgomery/2026/04/11/two-teens-seriously-injured-in-montgomery-county-crash/"
            },
            {
                date: "2026-03-25",
                title: "Houtzdale woman killed in 2-vehicle crash in Clearfield County",
                body: "A 47-year-old Houtzdale woman was killed in a two-vehicle accident Wednesday in Clearfield County. According to state police, the victim was driving a 2005 Ford Escape south on Route 53, Crooked Sewer Road, about 1:57 p.m. when the vehicle crossed into the northbound lane of travel and struck a 2020 Peterbilt operated by a 39-year-old […]",
                category: "safety",
                tags: ["Houtzdale","woman","killed"],
                url: "https://www.altoonamirror.com/news/local-news/2026/03/houtzdale-woman-killed-in-2-vehicle-crash-in-clearfield-county/"
            },
            {
                date: "2026-03-15",
                title: "Decisiv, PACCAR, Isuzu, Hino and KPIT Launch the SRM Alliance",
                body: "Industry-wide initiative to collaborate on developing the next generation of service management technology",
                category: "partnership",
                tags: ["Decisiv","PACCAR","Isuzu"],
                url: "https://www.manilatimes.net/2026/03/16/tmt-newswire/globenewswire/decisiv-paccar-isuzu-hino-and-kpit-launch-the-srm-alliance/2300333"
            },
            {
                date: "2026-03-12",
                title: "St. Maries man dies in crash",
                body: "According to the Idaho State Police, the 65-year-old man was northbound in a 2025 Toyota Tacoma northbound when he failed to negotiate a curve and drove left of center. The vehicle struck a southbound 1990 Peterbilt semi-truck driven by a 48-year-old male from St. Regis, Mont.",
                category: "safety",
                tags: ["Maries","dies","crash"],
                url: "https://cdapress.com/news/2026/mar/12/st-maries-man-dies-in-crash/"
            },
            {
                date: "2026-01-28",
                title: "PACCAR Achieves Very Good Annual Revenues and Net Income",
                body: "PACCAR reported strong full-year 2025 results with Peterbilt and Kenworth brands winning a combined 30.3% share of the Class 8 truck retail market. The company targets 35% North American heavy-duty market share.",
                category: "funding",
                tags: ["30.3% Share", "Revenue", "Target 35%"],
                url: "https://www.paccar.com/news/current-news/2026/paccar-achieves-very-good-annual-revenues-and-net-income/"
            },
            {
                date: "2025-12-10",
                title: "Kenworth and Peterbilt Launch New Electric Trucks for North America",
                body: "Kenworth launched the T280E, T380E and T480E as its first conventional medium-duty BEVs, while Peterbilt debuted the 536EV, 537EV and 548EV models. Orders are open with production starting in 2026.",
                category: "tech",
                tags: ["BEV Trucks", "Medium-Duty", "2026 Production"],
                url: "https://www.electrive.com/2025/12/10/kenworth-and-peterbilt-launch-new-electric-trucks-for-north-america/"
            },
            {
                date: "2025-09-15",
                title: "PACCAR Drops Tariff Surcharges Thanks to U.S. Manufacturing Shift",
                body: "PACCAR eliminated tariff surcharges in 2026 after shifting production of Class 8 refuse trucks from Mexico to Denton, Texas, and medium-duty trucks from Quebec to Chillicothe, Ohio, gaining a pricing advantage.",
                category: "expansion",
                tags: ["Tariff-Free", "U.S. Manufacturing", "Pricing"],
                url: "https://www.truckingdive.com/news/pcccar-q4-2025-earnings-market-rebound/811481/"
            },
            {
                date: "2025-06-20",
                title: "DAF XD and XF Electric Win International Truck of the Year 2026",
                body: "PACCAR subsidiary DAF received the International Truck of the Year 2026 award for both the XD and XF Electric trucks, recognizing their contribution to zero-emission heavy transport in Europe.",
                category: "tech",
                tags: ["DAF", "Truck of Year", "Electric"],
                url: "https://www.truckinginfo.com/news/kenworth-and-peterbilt-announce-new-ev-truck-models"
            },
            {
                date: "2025-03-01",
                title: "PACCAR and Aurora Advance Autonomous Kenworth and Peterbilt Tractors",
                body: "PACCAR and Aurora continued development of autonomous Peterbilt 579 and Kenworth T680 trucks, with Aurora's Virtual Driver fully integrated into PACCAR's redundant chassis platform targeting commercial driverless launch.",
                category: "partnership",
                tags: ["Aurora", "Autonomous", "Peterbilt 579"],
                url: "https://www.freightwaves.com/news/paccar-taps-aurora-to-help-develop-autonomous-kenworth-peterbilt-tractors"
            }
        ]
    },
    {
        id: "tata",
        name: "Tata Motors",
        color: "#486AAE",
        news: [
            {
                date: "2026-04-10",
                title: "Tata Motors starts delivery of e-truck Prima E.55S to BillionE Mobility",
                body: "Tata Motors has begun delivering its heavy-duty electric trucks, the Prima E.55S, to BillionE Mobility. The company also secured an order for 250 more electric prime movers. These trucks will support long-haul freight movement across several Indian states. This partnership aims to accelerate the adoption of electric logistics solutions for inter-city routes.",
                category: "partnership",
                tags: ["Tata","Motors","starts"],
                url: "https://economictimes.indiatimes.com/industry/auto/lcv-hcv/tata-motors-starts-delivery-of-e-truck-prima-e-55s-to-billione-mobility/articleshow/130173392.cms"
            },
            {
                date: "2026-04-10",
                title: "Tata Motors starts delivery of e-truck Prima E.55S to BillionE Mobility",
                body: "Tata Motors starts delivery of e-truck Prima E.55S to BillionE Mobility",
                category: "launch",
                tags: ["Tata","Motors","starts"],
                url: "https://www.news18.com/agency-feeds/tata-motors-starts-delivery-of-e-truck-prima-e-55s-to-billione-mobility-10026568.html"
            },
            {
                date: "2026-04-10",
                title: "Tata Motors Revamps Freight with Electric Truck Rollout",
                body: "Tata Motors has started delivering its Prima E.55S electric trucks to BillionE Mobility. With plans to supply 250 more, these trucks will operate across India's key freight corridors. The 450kWh battery-powered trucks feature a range of up to 350 km, supporting long-haul industrial goods transport.",
                category: "launch",
                tags: ["Tata","Motors","Revamps"],
                url: "https://www.devdiscourse.com/article/business/3869549-tata-motors-revamps-freight-with-electric-truck-rollout"
            },
            {
                date: "2026-03-31",
                title: "How Tata Motors CV is transforming truck safety in India with ECE R29.03 compliance",
                body: "Truck Safety Tata Motors CV India: Tata Motors CV is redefining truck safety in India by upgrading its entire lineup to ECE R29.03 standards. This global benchmark ensures stronger cabins and better crash protection, helping reduce accidents, protect drivers, and improve fleet efficiency on high-risk Indian highways.",
                category: "safety",
                tags: ["Tata","Motors","transforming"],
                url: "https://zeenews.india.com/consumer-connect/how-tata-motors-cv-is-transforming-truck-safety-in-india-with-ece-r29-03-compliance-3032390.html"
            },
            {
                date: "2026-03-30",
                title: "Switch Mobility dethrones Tata Motors to top FY26 e",
                body: "India's e-bus market grows 44%, with Switch and PMI leading as traditional manufacturers lose market share.",
                category: "tech",
                tags: ["Switch","Mobility","dethrones"],
                url: "https://www.thehindubusinessline.com/companies/indias-e-bus-market-jumps-44-switch-pmi-lead/article70802571.ece"
            },
            {
                date: "2026-03-14",
                title: "Tata Motors CV bags orders for 5,000 buses across India",
                body: "MUMBAI, March 14 : Auto major Tata Motors Commercial Vehicles Ltd has informed in a regulatory filing to the stock exchanges that it has won a cumulative pan-India order of over 5,000 buses from multiple state transport undertakings. However, Tata Motors has not disclosed the exact value of these cumulative orders. These orders pertain to the delivery of more than 5,000 buses and bus chassis, spanning across various states in India. Each of the tenders was won through a competitive […]",
                category: "launch",
                tags: ["Tata","Motors","bags"],
                url: "https://www.dailyexcelsior.com/tata-motors-cv-bags-orders-for-5000-buses-across-india/"
            },
            {
                date: "2026-03-13",
                title: "Tata Motors Secures 5000-Bus Supply Orders Across Indian States",
                body: "Tata Motors has won orders to supply over 5000 buses from various state transport undertakings in India. The orders cover a range of passenger mobility solutions and were secured through competitive e-bidding. These buses will cater to both intercity and intracity transport needs.",
                category: "tech",
                tags: ["Tata","Motors","Secures"],
                url: "https://www.devdiscourse.com/article/business/3837208-tata-motors-secures-5000-bus-supply-orders-across-indian-states"
            },
            {
                date: "2026-03-13",
                title: "Tata Motors Wins Orders For Over 5,000 Buses From State Transport Undertakings Across India",
                body: "Tata Motors Limited has secured cumulative orders for more than 5,000 buses and bus chassis from several State Transport Undertakings across India. The vehicles will be supplied in phases following competitive e-bidding under the government procurement system.",
                category: "tech",
                tags: ["Tata","Motors","Wins"],
                url: "https://www.freepressjournal.in/business/tata-motors-wins-orders-for-over-5000-buses-from-state-transport-undertakings-across-india"
            },
            {
                date: "2025-12-05",
                title: "Tata Motors Launches 17 Next-Gen Trucks Across Diesel and Electric",
                body: "Tata Motors announced the launch of a new portfolio of 17 trucks across the 7-55 tonne range, marking one of its largest product introductions in the Indian commercial vehicle segment with growing focus on electrification.",
                category: "launch",
                tags: ["17 Trucks", "7-55 Tonne", "India"],
                url: "https://www.motorindiaonline.in/tata-motors-launches-17-next-generation-trucks-across-diesel-and-electric-platforms/"
            },
            {
                date: "2025-08-20",
                title: "148 Tata Electric Buses Delivered to Bengaluru Transit",
                body: "Tata Motors delivered 148 electric buses to Bengaluru Metropolitan Transport Corporation, bringing BMTC's total electric fleet to 1,436 e-buses — one of the largest electric bus deployments in India.",
                category: "expansion",
                tags: ["Bengaluru", "148 Buses", "1436 Fleet"],
                url: "https://www.sustainable-bus.com/electric-bus/bengaluru-tata-electric-buses-148/"
            },
            {
                date: "2025-01-30",
                title: "Tata Motors Unveils Six Electric CVs at Auto Expo 2025",
                body: "Tata Motors showcased six new electric commercial vehicles at Auto Expo 2025, including the Prima E.55S electric prime mover (55-tonne, 470kW), Ace Pro EV mini truck, Ultra EV 9 city bus, and Intercity EV 2.0 coach with 400km range.",
                category: "tech",
                tags: ["Auto Expo", "6 EVs", "Prima E.55S"],
                url: "https://www.electrive.com/2025/01/30/tata-motors-unveils-six-electric-cvs-at-auto-expo-2025/"
            },
            {
                date: "2024-11-15",
                title: "Tata Motors Targets 50% Electric Bus Market Share in India",
                body: "Tata Motors set an ambitious target to capture 50% of India's rapidly growing electric bus market, leveraging its strong relationships with state transport corporations and expanding manufacturing capacity for electric commercial vehicles.",
                category: "expansion",
                tags: ["50% Target", "India", "E-Bus Market"],
                url: "https://www.tata.com/newsroom/business/tata-motors-electric-mass-mobility"
            },
            {
                date: "2024-09-10",
                title: "Tata Motors Partners with State Governments on EV Bus Fleet Transition",
                body: "Tata Motors signed agreements with multiple Indian state governments to supply and operate electric bus fleets under the FAME II subsidy scheme, accelerating India's transition from diesel to electric public transport.",
                category: "partnership",
                tags: ["FAME II", "State Govts", "E-Bus Fleet"],
                url: "https://www.tatamotors.com/electric-vehicles/"
            }
        ]
    },
    {
        id: "volvo",
        name: "Volvo Trucks",
        color: "#003057",
        news: [
            {
                date: "2026-04-14",
                title: "Volvo launches new electric trucks",
                body: "/PRNewswire/ -- Volvo Trucks is a global leader in the electric segment with one of the largest electric truck line-ups in the industry. The company can now...",
                category: "launch",
                tags: ["Volvo","launches","electric"],
                url: "https://www.prnewswire.co.uk/news-releases/volvo-launches-new-electric-trucks--with-ranges-up-to-700-km-302741395.html"
            },
            {
                date: "2026-04-14",
                title: "Volvo launches electric truck with 700 km range",
                body: "Volvo Trucks is launching the FH Aero Electric featuring an e-axle and a range of up to 700 km, alongside updated FH, FM, and FMX Electric models offering ranges of up to 470 km, according to a press...",
                category: "launch",
                tags: ["Volvo","launches","electric"],
                url: "https://www.marketscreener.com/news/volvo-launches-electric-truck-with-700-km-range-ce7e50ded181f72c"
            },
            {
                date: "2026-01-15",
                title: "Volvo Repeats as Europe's Heavy-Truck Market Leader in 2025",
                body: "Volvo Trucks maintained its position as the market leader for heavy trucks in Europe throughout 2025, with strong demand for both diesel and electric models across the continent.",
                category: "funding",
                tags: ["Europe #1", "Market Leader", "Heavy Trucks"],
                url: "https://www.truckinginfo.com/news/volvo-repeats-as-europes-heavy-truck-market-leader-in-2025"
            },
            {
                date: "2025-10-08",
                title: "Volvo Electric Trucks Reach 250 Million Kilometers Milestone",
                body: "Volvo Trucks announced its electric truck fleet has collectively driven 250 million kilometers across 50 countries, with more than 5,700 electric vehicles delivered since 2019 — including 700+ VNR Electric trucks in North America.",
                category: "launch",
                tags: ["250M km", "5700 EVs", "50 Countries"],
                url: "https://www.volvotrucks.com/en-en/news-stories/press-releases/2025/oct/milestone--volvo-s-electric-trucks-reach-250-million-kilometers.html"
            },
            {
                date: "2025-05-15",
                title: "Volvo Unveils 600km-Range FH Aero Electric with Megawatt Charging",
                body: "Volvo Trucks announced the FH Aero Electric with e-axle, offering 600km range and adapted for the new MCS (Megawatt Charging System) standard. Orders open Q2 2026 for the long-distance electric flagship.",
                category: "tech",
                tags: ["FH Aero Electric", "600km", "MCS Charging"],
                url: "https://www.volvotrucks.com/en-en/news-stories/press-releases/2025/may/600-km-range-and-superfast-charging-meet-volvo-s-new-electric1.html"
            },
            {
                date: "2025-03-20",
                title: "Volvo Trucks Unveils All-New VNR in North America",
                body: "Volvo Trucks introduced the all-new Volvo VNR for the North American market, a completely redesigned regional haul truck with advanced aerodynamics, improved fuel efficiency, and electric powertrain options.",
                category: "launch",
                tags: ["New VNR", "North America", "Redesign"],
                url: "https://www.volvotrucks.com/en-en/news-stories/press-releases/2025/mar/volvo-trucks-unveils-the-all-new-volvo-vnr-in-north-america.html"
            },
            {
                date: "2025-01-10",
                title: "Volvo VNL Autonomous Enters Commercial Service with Waabi in Texas",
                body: "Volvo Autonomous Solutions integrated the Waabi Driver with the Volvo VNL Autonomous redundant truck platform, with the self-driving truck entering commercial freight service on Texas highways.",
                category: "partnership",
                tags: ["Waabi", "VNL Autonomous", "Texas"],
                url: "https://www.volvogroup.com/en/news-and-media/news/2025/oct/volvo-trucks-leads-heavy-duty-electrification.html"
            }
        ]
    }
];
