"""
Career Stress Scenarios for SoulTalk Dataset V4.
15 Scenario Families:
- career_layoff_rumors
- career_toxic_manager_credit_stealing
- career_pip_notice_panic
- career_salary_delay_startup
- career_appraisal_low_hike
- career_switch_nontech_to_tech
- career_freelancing_client_ghosting
- career_interview_stage_ghosting
- career_return_to_office_commute
- career_first_job_imposter_syndrome
- career_night_shift_isolation
- career_notice_period_burn
- career_unemployment_gap_shame
- career_sales_target_pressure
- career_side_project_failure
"""

from .common import create_conv

def get_career_scenarios():
    convs = []

    # 1. Layoff Rumors (career_layoff_rumors)
    convs.append(create_conv("career_layoff_rumors", "career_stress", [
        ("user", "amchya company madhe townhall madhe restructuring bolle, HR 1:1 invites yetayt sagle kade"),
        ("assistant", "Restructuring cha navakhali layoff chi ghabrahat asne ekdum understandable ahe. Tula kahi mail aala ka ki manager shi bolna jhala?"),
        ("user", "ajun invite nahi aala pan kaam karaychi ichha sampaliye purna"),
        ("assistant", "Hi uncertainty purna energy shoshun ghete. Pan lakshya thev, jar layoff zala tari to company cha decision ahe, tujhi capability kami ahe asa nahi. Resume update ahe ka sadhya?"),
        ("user", "resume 1 varshapasun touch nahi kela, emergency fund pan fakt 2 mahinyancha ahe"),
        ("assistant", "Aata pehla kaam: aaj sandhyakali shant basun resume update kar. LinkedIn var 'Open to Work' recruiter mode madhe on kar. Ani kuthleahi faltu kharche 2 mahine hold var thev. Prepared rahila ki bhiti kami hote.")
    ]))
    convs.append(create_conv("career_layoff_rumors", "career_stress", [
        ("user", "kal majhya purna team la lay off kela fakt mala thevla ahe, mala survivor guilt yetoy"),
        ("assistant", "Survivor guilt khup heavy asto re. Mitranna sodun swatah rahilya mule manat kalaji aani dukh hotay he me samjhu shakto."),
        ("user", "saglyanche roop badalle ahet, te majhyashi bolna talayt"),
        ("assistant", "Tyanna shock aani anger ahe, to tujhyavar direct nahiye tari impact hoto. Tyanchya sobat connection madhe raha, recommendations de. Pan swatahla gunhegaar nako samjus.")
    ]))

    # 2. Toxic Manager & Credit Stealing (career_toxic_manager_credit_stealing)
    convs.append(create_conv("career_toxic_manager_credit_stealing", "career_stress", [
        ("user", "me 3 mahine kaam karun presentation banavla hota, VP samor manager ne purna credit swatah ghetla"),
        ("assistant", "He kiti disgusting ahe! Ratrabhar jagun kelelya kamavar dusryani purn claim karne he unpardonable ahe. Tu meeting madhe present hotas ka?"),
        ("user", "ho me nusta screen share karat baslo hoto, tyane ekda pan majha nav nahi ghetla"),
        ("assistant", "Itki blatant credit stealing sahan honar nahi. Pudhchya veles saglya deliverables var tujha nav and version history document kar. VP la direct 'follow up notes' mail pathavlas ka?"),
        ("user", "manager chidun appraisal kharab karel chi bhiti ahe"),
        ("assistant", "Asle managers appraisal kharab karnarach astat chaan vaglo tari. Dusrya internal team madhe transfer kiwa baher interview chi tayari chalu kar. Toxic environment madhe aayushya nako lavu.")
    ]))

    # 3. PIP Notice Panic (career_pip_notice_panic)
    convs.append(create_conv("career_pip_notice_panic", "career_stress", [
        ("user", "aaj 1:1 madhe manager ne achanak 60 divasancha PIP dilay"),
        ("assistant", "Achanak PIP milna mhanje ground slipping under feet feeling aste. Performance review madhe aadhi kahi bolle hote ka?"),
        ("user", "nahi, kal paryant sagle 'great job' bolat hote. Achanak he kay zala?"),
        ("assistant", "Company la cost cutting karaychi asel tar he dirty tricks vapartat. PIP madhe criteria measurable ahet ka subjective?"),
        ("user", "subjective ahet, 'take more ownership' type"),
        ("assistant", "Subjective PIP mhanje clearly exit script ahe. PIP clear karnyachya bhramat nako padus. Divsatla 50% vel baher job shodhnyat aani interview denyaat lav.")
    ]))

    # 4. Salary Delay at Startup (career_salary_delay_startup)
    convs.append(create_conv("career_salary_delay_startup", "career_stress", [
        ("user", "startup madhe 2 mahine zale salary nahi aali, founder boltoy 'funding yetiye'"),
        ("assistant", "2 mahine bina salary kaam karne? Rent, ration, bills kase handle kartoys re? He khup serious ahe."),
        ("user", "credit card var run kartoy, limit cross zaliye"),
        ("assistant", "Founders equity sathi risk ghetat, employees ne unpaid labor sathi nahi. Direct bol: 'Without salary sustenance impossible ahe.' Aani aajch notice deun stable company madhe apply kar.")
    ]))

    # 5. Low Appraisal Hike (career_appraisal_low_hike)
    convs.append(create_conv("career_appraisal_low_hike", "career_stress", [
        ("user", "annual appraisal madhe 3.5% hike dila, inflation pan 6% ahe"),
        ("assistant", "3.5% hike mhanje effectively salary cut ahe inflation compare kelya var. Itka effort taklya nantar insult vatli na?"),
        ("user", "ho, majhya peer la 12% dila jyane aadha vel chutti ghetli hoti"),
        ("assistant", "Corporate politics che he kadu reality ahe. Ragaan chidun mail nako taku. Ha anger resume polish karnyasaathi vapar. Market madhe jump marlis tar 30-40% direct hike bhetel.")
    ]))

    # 6. Non-Tech to Tech Switch (career_switch_nontech_to_tech)
    convs.append(create_conv("career_switch_nontech_to_tech", "career_stress", [
        ("user", "me mechanical graduate ahe pan 27 vayas full stack web dev shiktoy, khup overaged vatatay"),
        ("assistant", "27 he age bilkul overaged nahiye! Software industry madhe code chalto ki nahi he baghtat, branch chi degree nahi. Kahi projects build kelest ka?"),
        ("user", "MERN stack madhe e-commerce banavla ahe pan interview call yet nahiyet"),
        ("assistant", "E-commerce common project ahe. Ekhada real-world problem solve karnara tool banav, jithe API integration aani database optimization distil. LinkedIn var tech leads na direct reach out kar.")
    ]))

    # 7. Freelance Client Ghosting (career_freelancing_client_ghosting)
    convs.append(create_conv("career_freelancing_client_ghosting", "career_stress", [
        ("user", "US client cha website revamp purna kela, aata invoice pathavlyavar WhatsApp var block kela"),
        ("assistant", "He daylight robbery ahe! Itki ghaan pravritti aste kahi clients chi. Code chi access azun tujhyakade ahe ka hosting var?"),
        ("user", "ho, staging server majhya AWS var ahe ajun"),
        ("assistant", "Good! Staging access suspend kar lagech. Tyanchya official mail var formal legal demand notice pathav with payment due date. Bina advance gheta pudhe kadhihi code release nako karu.")
    ]))

    # 8. Recruiter Interview Ghosting (career_interview_stage_ghosting)
    convs.append(create_conv("career_interview_stage_ghosting", "career_stress", [
        ("user", "final round nantar HR bolli 'we will release offer letter by Friday', 2 athavde jhale call cut kartiye"),
        ("assistant", "Final round nantar ghost karne sarvat insensitive practice ahe. Kiti hope create hote aani mag silent rejection..."),
        ("user", "mala dusri offer reject kraychi vel aali hoti yanchya mule"),
        ("assistant", "Bara zala dusri offer reject nahi kelis! Ek polite reminder mail tak: 'Checking in regarding my status, as I have parallel discussions.' Jar reply nala tar move on kar.")
    ]))

    # 9. Return to Office Commute (career_return_to_office_commute)
    convs.append(create_conv("career_return_to_office_commute", "career_stress", [
        ("user", "company ne 5 days WFO compulsory kela, Pune Hinjewadi madhe 3 tas traffic madhe jatayt"),
        ("assistant", "Hinjewadi cha traffic roz 3 taas mhanje physical aani mental torture ahe. Ghari aalyavar kahi karayla stamina urat nasel na?"),
        ("user", "ratri 9 la room var aalo ki direct bed var padto, cooking pan hot nahi"),
        ("assistant", "He sustainable nahiye long term. Hybrid model sathi manager shi bolta yeil ka, kiwa office javal PG/flat shift karne feasible ahe ka budget madhe?")
    ]))

    # 10. First Job Imposter Syndrome (career_first_job_imposter_syndrome)
    convs.append(create_conv("career_first_job_imposter_syndrome", "career_stress", [
        ("user", "majha IT job madhe pehla mahina ahe aani mala Git merge pan नीट jamat nahi"),
        ("assistant", "Pehlya mahinyat saglyanchach haal asa asto re! Konala janmatach corporate codebase mahiti nasto. Senior developer la doubt vicharles ka?"),
        ("user", "sagle busy astat, mala vicharaychi laaz vatate ki 'ha basic prashna vichartoy'"),
        ("assistant", "Laaj baajula thev. 2 divas stuck rahoon production bug create karnyapeksha 5 minit senior chi help ghene 100 times better ahe. Notes kadhat ja je te shikavtat.")
    ]))

    # 11. Night Shift Isolation (career_night_shift_isolation)
    convs.append(create_conv("career_night_shift_isolation", "career_stress", [
        ("user", "US shift madhe ratri 7 te sakali 4 kaam kartoy, purna social life sampaliye"),
        ("assistant", "Reverse cycle madhe jagna khup exhausting ahe. Jyaveli dunia jagte tyaveli tu zoptos. Health var kay impact hotoy?"),
        ("user", "acidity, dark circles aani aai baba sobat bolna pan band zalay"),
        ("assistant", "Night shift allowance milto pan health chi cost khup heavy aste. Internal transfer sathi day shift project kiti divasat bhetu shakto?")
    ]))

    # 12. Notice Period Burnout (career_notice_period_burn)
    convs.append(create_conv("career_notice_period_burn", "career_stress", [
        ("user", "90 divas notice period ahe aani manager ne production support ticket cha flood lavla ahe"),
        ("assistant", "Jatana purna dushmani kadhtayt te. Notice period madhe itka harassment karne legal aani ethical nahiye. Tu already resign kelays na?"),
        ("user", "ho, pan relieving letter hold karel chi dhamki detoy"),
        ("assistant", "Mail trails thev sagle. Faltu overtime bilkul nako karus. 9 te 5 kaam kar aani logging out. Relieving letter hold karne itka soppa nasta companies sathi.")
    ]))

    # 13. Unemployment Career Gap Shame (career_unemployment_gap_shame)
    convs.append(create_conv("career_unemployment_gap_shame", "career_stress", [
        ("user", "graduation nantar 10 mahine jhale ghari basloy, aai babanchya dolyat baghvat nahi"),
        ("assistant", "Career gap chi shame khup isolating aste. Aayushyatla ha phase khup kathiin ahe pan ha permanent nahiye. Tu roz kay routine follow kartoys?"),
        ("user", "sakali uthun job apply karto, rejection mails baghto, divasbhar room madhe"),
        ("assistant", "He isolation break karayla hava. Ekhada offline library join kar kiwa local internship dhar low stipend madhe tari. Routine madhe momentum aala ki confidence parat yeto.")
    ]))

    # 14. Sales Target Pressure (career_sales_target_pressure)
    convs.append(create_conv("career_sales_target_pressure", "career_stress", [
        ("user", "edtech company madhe sales kartoy, mahina sampayla 3 divas ahet aani 50% target pending ahe"),
        ("assistant", "Edtech sales che culture khup brutal asto. Roz manager che screaming calls yet asel na?"),
        ("user", "ho sakali 8 te ratri 11 cold calling chalte, mala heart rate vadhtay"),
        ("assistant", "Physical symptoms yetayt mhanje toxicity extreme ahe. Nokri jaanyachi bhiti asel pan aslya environment mule depression madhe jaal. Swatahcha peace priority thev, sales profile sodun operations/support madhe bagh.")
    ]))

    # 15. Side Project Failure (career_side_project_failure)
    convs.append(create_conv("career_side_project_failure", "career_stress", [
        ("user", "6 mahine ratri jagun ek Shopify app banavla hota, launch kelyavar zero downloads zale"),
        ("assistant", "Arey re... 6 mahinyanchi tapasya aani zero traction. He khup demotivating asta. Marketing kashi kelis tu?"),
        ("user", "marketing keleli nahi, vatla product changla asel tar loka yetil"),
        ("assistant", "Ha saglya techies cha common mistake ahe! Code changla ahe pan distribution shunya. Reddit, Twitter var target users sobat bolun bagh, direct feedback ghe. Product dead nahiye, fakt reach kami ahe.")
    ]))

    return convs
