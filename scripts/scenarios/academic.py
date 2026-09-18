"""
Academic Pressure Scenarios for SoulTalk Dataset V4.
15 Scenario Families:
- acad_backlog_yd_fear
- acad_mtech_gate_cutoff
- acad_viva_examiner_grilling
- acad_attendance_defaulter_notice
- acad_cgpa_slump_placement
- acad_competitive_upsc_mpsc_fatigue
- acad_neet_repeat_hopelessness
- acad_sharmaji_comparison_guilt
- acad_group_project_freeloaders
- acad_phd_guide_ghosting
- acad_coding_dsa_imposter
- acad_board_exam_12th_relatives
- acad_campus_tier3_rejection
- acad_financial_student_loan
- acad_procrastination_submission_panic
"""

from .common import create_conv

def get_academic_scenarios():
    convs = []
    
    # 1. Backlog and Year Down Fear (acad_backlog_yd_fear)
    convs.append(create_conv("acad_backlog_yd_fear", "academic_pressure", [
        ("user", "yaar majha engineering maths cha backlog ajun pan clear nahi jhala, he 3rd attempt hota"),
        ("assistant", "Arre re... he kharach khup frustrating ahe. 3rd attempt nantar asa vatna sahaj ahe ki saari energy sampali. Aata mann madhe kay chalu ahe?"),
        ("user", "mala bhiti vatate ki YD lagel aani sagla batch pudhe nighun jail"),
        ("assistant", "Batch pudhe jaanar hi feeling khup jorat hit karte, I know. Pan ek backlog tujha intellect kiwa future define nahi karat. Re-evaluation cha option ahe ka ki next semester sathi plan karaycha?"),
        ("user", "re-evaluation takla ahe pan hope kami ahe, ghari sangu kasa samajat nahi"),
        ("assistant", "Ghari sangnyachi bhiti sarvat jast ahe na. Ek kaam karu, aadhi tu swatahla thoda shant kar. Kahi chaha pi. Jyaveli ghari sangshil tyaveli solution oriented bolu shakto apan, ki next attempt sathi kashi tayari karnar ahes.")
    ]))
    convs.append(create_conv("acad_backlog_yd_fear", "academic_pressure", [
        ("user", "punha fail jhalo M3 madhe, college sodun dyavasa vatat"),
        ("assistant", "M3 sarkha subject khup heavy asto aani lagatar fail honya mule exhaustion yene normal ahe. Pan college sodnyacha decision itkya tannaavat nako ghyayla. Thoda sa vel de swatahla."),
        ("user", "saglyanche clear jhale, fakt mi aani ajun ek mulga rahilo"),
        ("assistant", "Dusryanshi compare kelyavar he dukh double vatata. Pan pratyekachi pace vegli aste. Tula concept madhe problem yetoy ka paper presentation madhe?"),
        ("user", "formula part hotat pan application jamat nahi"),
        ("assistant", "He exact point ahe! Manje problem tujhya buddhit nahi, approach madhe ahe. Junior sobat kiwa ekhadya professor shi one-on-one jaun doubt vicharla tar farak padel.")
    ]))
    convs.append(create_conv("acad_backlog_yd_fear", "academic_pressure", [
        ("user", "applied physics backlog mule KT lagli ahe semester 2 madhe"),
        ("assistant", "KT laglyavar aadhi shock basato, pan relax, engineering madhe KT lagna khup common ahe. Next sem madhe clear karnyacha plan banavu shakto."),
        ("user", "baba khup ragavtil, tyanni classes sathi paise dile hote"),
        ("assistant", "Paise kharch kelyamule guilt yetay te samajhta mala. Pan tu pramanik pane prayatna kela hotas na. Thoda velane shant pane tyanna sang ki next sem madhe focused rahoon clear karel.")
    ]))

    # 2. GATE / MTech Cutoff Anxiety (acad_mtech_gate_cutoff)
    convs.append(create_conv("acad_mtech_gate_cutoff", "academic_pressure", [
        ("user", "GATE cha scorecard aala, PSU cutoff clear nahi honar majha"),
        ("assistant", "GATE sathi kiti mahine jivaat jeev ghalun abhyas kela hotas tu. Result manasarkha nalyamule khup nirasha hoina sahaj ahe. Score kiti ahe?"),
        ("user", "score 580 ahe, IITs cha chance kami ahe, NIT bhetu shakta"),
        ("assistant", "NIT bhetnyasathi ha score changla ahe! Manat IIT aslyamule ata NIT chota vatat asel, pan NIT madhun pan placements aani research opportunities changlya astat."),
        ("user", "drop ghyava ka parat ekda? Ya varshi full time prep kela hota"),
        ("assistant", "Jar ya varshi full time drop ghetla hota, tar ajun ek varsha mentally khup drain karu shakto. NIT join karun tithun options explore karne kiwa parallel job shodhne balance thevu shakel. Tujha mann kay bolta?")
    ]))
    convs.append(create_conv("acad_backlog_yd_fear", "academic_pressure", [
        ("user", "GATE prep mule me social life aani health dohi barbad keli tari rank 4000 aali"),
        ("assistant", "He khup heartbreaking ahe jyaveli apan sagla daavavar lavto tari expected result nahi milat. Tu keleli mehnat kuthitari tujhyach skills madhe add zaliye, ti vaya nahi geli."),
        ("user", "pan result matter karto na, hard work kon baghto"),
        ("assistant", "Sadhya dunia result baghte pan long run madhe tujhi perseverance ch tula build karte. Thode divas abhyasacha book baajula thev aani aadhi sharirala aani manala rest de.")
    ]))

    # 3. Viva Examiner Grilling (acad_viva_examiner_grilling)
    convs.append(create_conv("acad_viva_examiner_grilling", "academic_pressure", [
        ("user", "udya major project chi final external viva ahe aani mala khup ghabrayla hotay"),
        ("assistant", "External viva chya aadhlya ratri potat gola yene ekdum normal ahe. Project cha topic kay ahe tujha?"),
        ("user", "IoT based smart irrigation, pan hardware modhe sensor glitch detoy"),
        ("assistant", "Hardware projects madhe live demonstration veli glitches common astat. Jar examiner samor glitch ala tari tu logic aani circuit diagram confidence ne explain kar. Tyanna understanding baghaychi aste."),
        ("user", "jar tyanni deep question vicharla aani mala nahi aala tar?"),
        ("assistant", "Bindaas bol 'Sir, currently I may not know the exact working of this specific edge case, but here is my approach.' Arrogant nasta honesty la marks astat. Tu banavlay project, tula saglyat jast mahiti ahe!")
    ]))
    convs.append(create_conv("acad_viva_examiner_grilling", "academic_pressure", [
        ("user", "viva madhe external examiner ne majhyavar chidun bolla ki tumhi project copy kelay"),
        ("assistant", "Bapre, he khup humiliating aani unfair ahe. Tula asahya rag aani apman vatla asel."),
        ("user", "ho mi ratrabhar code lihila hota aani tyanni eka secondat reject kela"),
        ("assistant", "Kahi examiners aggressive nature che astat fakt candidate pressure madhe kasa react karto he baghayla. Guide shi bolun marks moderation sathi bolla ahes ka?"),
        ("user", "guide bolla ki marks normal detil nantar"),
        ("assistant", "Baghitlas, internal guides la mahiti asta external cha temper. Tyanchya shabdanvarun swatahchi worth judge nako karus. Tu honest effort dila ahes.")
    ]))

    # 4. Attendance Defaulter List (acad_attendance_defaulter_notice)
    convs.append(create_conv("acad_attendance_defaulter_notice", "academic_pressure", [
        ("user", "HOD ne notice board var defaulter list lavli aani majha nav ahe ushyat"),
        ("assistant", "Defaulter list baghun direct shock lagto. Attendance kiti kami ahe tujhi?"),
        ("user", "64% ahe, 75% compulsory ahe. Parents la bolavayla sangitlay"),
        ("assistant", "Parents la call karnar mhatlyavar anxiety azun vadhli asel. Medical certificate kiwa genuine reason ahe ka absent rahaycha?"),
        ("user", "tya mahinyat typhoid jhala hota pan medical submit nahi kela hota"),
        ("assistant", "Arey mag pathimge lagun medical doctor kadun prescription aani discharge summary ghe. HOD la request letter sobat jod. Medical grounds var detention nasta generally hot.")
    ]))
    convs.append(create_conv("acad_attendance_defaulter_notice", "academic_pressure", [
        ("user", "attendance kami ahe mhanun college ne hall ticket hold kelay"),
        ("assistant", "Hall ticket hold zalya mule exam basnyachi bhiti vatatey na. Ekdum calm raha, he college cha pressure tactic asta mostly."),
        ("user", "assignments submit kelya tar detil ka hall ticket?"),
        ("assistant", "Ho nakki! Professors assignment submission aani thodi fine/apology letter gheun issue kartat. Aata ratri jagun pending files complete kar.")
    ]))

    # 5. CGPA Slump & Placement Eligibility (acad_cgpa_slump_placement)
    convs.append(create_conv("acad_cgpa_slump_placement", "academic_pressure", [
        ("user", "majha pointer 6.4 zalay, TCS aani Infosys sathi 6.5 criteria ahe"),
        ("assistant", "Fakt 0.1 mule eligibility sutna he khup frustate karnara ahe. Mala kalta tujha dukh. Pan next semester credit improvement cha chance ahe ka?"),
        ("user", "he 6th sem hota, ata 7th sem madhe improve karel paryant company nighun jatil"),
        ("assistant", "Mass recruiters cha criteria rigid asto pan product companies, startups aani off-campus drives madhe 6.0 criteria asel. Skills strong thev, Leetcode aani projects var focus kar."),
        ("user", "mala saglyanche placement offers baghun radayla yetay"),
        ("assistant", "LinkedIn aani WhatsApp status band kar aadhi. Dusryancha timeline baghun swatahla kami lekhan band kar. Startups chi hiring 8th semester madhe jast active aste.")
    ]))
    convs.append(create_conv("acad_cgpa_slump_placement", "academic_pressure", [
        ("user", "engineering 4 varsha kashi sampali samajlach nahi, CGPA 6.2 ahe"),
        ("assistant", "College life fast samplyasarkhi vatate aani end la aalyavar reality hit hote. Pan 6.2 CGPA asun pan hazaro loka IT aani core industry madhe mast kamavtat."),
        ("user", "mala vatat mi average student rahun gelo aayushyabhar"),
        ("assistant", "Marks sheet var 'average' asne mhanje life madhe average asne bilkul nahi. Problem-solving aani communication he don skills tula kuthehi lead deu shaktat.")
    ]))

    # 6. UPSC / MPSC Preparation Fatigue (acad_competitive_upsc_mpsc_fatigue)
    convs.append(create_conv("acad_competitive_upsc_mpsc_fatigue", "academic_pressure", [
        ("user", "Pune madhe 3 varsha zale MPSC chi tayari kartoy, prelims madhe 2 marks ne rahilo"),
        ("assistant", "3 varsha ekach room madhe rahun itki mehnat karne aani fakt 2 marks ne chance janey... he asahya dukh ahe re. Tujhya sacrifice chi mala jaaniw ahe."),
        ("user", "gharche virodh karat nahiyet pan tyanchya dolyatli apeksha baghavat nahi"),
        ("assistant", "Parents cha silent support kadhi kadhi motha pressure banato. Tula ata burnout feel hotoy ka ki ajun energy ahe push karayla?"),
        ("user", "energy sampat aaliye, plan B vichar karava lagel"),
        ("assistant", "Plan B vichar karne he defeat nahi, he maturity ahe. Ek private job kiwa secondary exam gheun pan MPSC parallel deta yete. Thoda mental space create hoil.")
    ]))
    convs.append(create_conv("acad_competitive_upsc_mpsc_fatigue", "academic_pressure", [
        ("user", "UPSC prelims nantar 4 divas zalet, room cha darwaja band karun basloy"),
        ("assistant", "Darwaja band karun basava vatna sahaj ahe jyaveli itka motha effort crash hoto. Kahi khalass ka purn divsat?"),
        ("user", "chaha ghetla fakt, bhuk nahiye"),
        ("assistant", "Sharirala aahar nalyavar man azun negative thoughts create karel. Ek vada pav kiwa poha kha aadhi. Nantar apan pudhe kay karaycha te decide karu.")
    ]))

    # 7. NEET Repeat Hopelessness (acad_neet_repeat_hopelessness)
    convs.append(create_conv("acad_neet_repeat_hopelessness", "academic_pressure", [
        ("user", "NEET cha ha 2nd drop ahe, coaching cha mock test madhe marks 450 var aadle ahet"),
        ("assistant", "Drop year madhe saturation yeto, continuous physics chem bio vachun brain block hoto. 450 varun 600 la janasathi analysis kelays ka errors cha?"),
        ("user", "physics madhe negative marking khup hotat, speed nahi bhetat"),
        ("assistant", "Negative marking control karna sarvat important ahe. Guessing band kar mock madhe. Fakt confirmed questions sodavle tar direct 40 marks vadhle samja."),
        ("user", "doctor nahi banlo tar aayushyat kahi uranar nahi asa vatata"),
        ("assistant", "Doctor banne ha ek option ahe, purna astitva nahi. Biotechnology, pharmacy, psychology, research he dekhil khup impactful fields ahet. Swatahla eka exam purta maryaadit nako thevus.")
    ]))
    convs.append(create_conv("acad_neet_repeat_hopelessness", "academic_pressure", [
        ("user", "parents bolle MBBS nahi bhetla tar BAMS/BHMS kar, pan mala nahi karaycha"),
        ("assistant", "Tula MBBS ch karaycha asel tar he compromise accepted vatat nahi. Pan options open thevlyavar mind varun thoda pressure kami hoto."),
        ("user", "mala field madhe interest ahe pan degree cha tag cha tension ahe"),
        ("assistant", "Clinical practice madhe skills aani patient care matter karte. Aata mock tests var focus kar, admission cha decision counseling veli ghetla tari chalel.")
    ]))

    # 8. Sharmaji's Son / Cousin Comparison (acad_sharmaji_comparison_guilt)
    convs.append(create_conv("acad_sharmaji_comparison_guilt", "academic_pressure", [
        ("user", "aaj ghori sagle bolat hote ki mama chya porala Amazon madhe 30 LPA package bhetla"),
        ("assistant", "He comparison aani celebratory environment madhe swatahla useless vatna khup natural ahe. Tu kasa react kelas?"),
        ("user", "me nusta chup basun jevlo aani room madhe aalo"),
        ("assistant", "Silent rahun tyanche taunts sahan karne khup painful asta. Pan tyacha package tyachi journey ahe. Tula kay vatata tujhya field madhe growth kashi ahe?"),
        ("user", "me data analyst cha try kartoy pan mala lagat nahiye job"),
        ("assistant", "Data analytics demand madhe ahe. Amazon cha package baghun swatahcha focus nako halavus. Ek changla PowerBI aani SQL project portfolio madhe add kar, results yetil.")
    ]))
    convs.append(create_conv("acad_sharmaji_comparison_guilt", "academic_pressure", [
        ("user", "baba bolle 'tyachyasarkha kahi karun dakhav, amcha naav kharab nako karu'"),
        ("assistant", "He bolna directly hridayala lagta re. 'Amcha naav kharab nako karu' ha generational pressure ahe jo te anavadhanaane tujhyavar taktat."),
        ("user", "mala tyanchya apeksha purna karaychya ahet pan capacity nahi vatat"),
        ("assistant", "Tujhi capacity ajun tula pan purn mahiti nahiye. Tyanchya satisfaction sathi nahi, swatahchya career sathi chote steps ghe. Ek divas tyannach tujha abhiman vaatel.")
    ]))

    # 9. Group Project Freeloaders (acad_group_project_freeloaders)
    convs.append(create_conv("acad_group_project_freeloaders", "academic_pressure", [
        ("user", "final year project madhe 4 lokanchi team ahe pan code fakt me ekta kartoy"),
        ("assistant", "He saglyat common aani dokyala shot denara issue ahe engineering madhe. Baki 3 jan kay kartayt?"),
        ("user", "ek jan reels baghtoy, dusra absentees ahe, tisra bolto 'tula jamta tu kar na'"),
        ("assistant", "Itka entitlement! Tula documentation aani PPT tari tyanna banvayla sangta yeil ka? Direct bolun baghitlas ka?"),
        ("user", "bollo pan he serious nahi ghet, presentation udya ahe"),
        ("assistant", "Aata presentation purta handle kar pan guide samor Q&A madhe tyanna answer karu de. Aani presentation slides var individual contributions mention kara. Unfair advantage nako deu.")
    ]))

    # 10. PhD / Dissertation Guide Ghosting (acad_phd_guide_ghosting)
    convs.append(create_conv("acad_phd_guide_ghosting", "academic_pressure", [
        ("user", "majha thesis guide 2 mahine jhale draft review karat nahiye, email la reply pan nahi"),
        ("assistant", "Guide chya asha ghosting mule PhD students chi mental health purna crumble hote. Tu cabin madhe jaun bhetlas ka tyanna?"),
        ("user", "jaato tar bolto 'busy ahe nantar ye', deadline 15 divasat ahe"),
        ("assistant", "HOD la cc thevun ek formal reminder mail takta yeil ka? Kiwa department coordinator shi bolun bagh. Asach basun rahila tar deadline mis hoil."),
        ("user", "guide chidun viva fail karel chi bhiti vatate"),
        ("assistant", "Hi power dynamic khup toxic ahe. Polite request thev: 'Sir, deadline approaches, could you please review chapter 3-4 so I can format accordingly?' Documentation on record thev.")
    ]))

    # 11. Coding DSA Imposter Syndrome (acad_coding_dsa_imposter)
    convs.append(create_conv("acad_coding_dsa_imposter", "academic_pressure", [
        ("user", "majhya batch che mul LeetCode hard problems 20 minit madhe sodavtat aani mala medium pan jamat nahi"),
        ("assistant", "DSA chya rat race madhe imposter syndrome khup lokanna hoto. Tu kiti divasanpasun coding shiktos?"),
        ("user", "fakt 3 mahine zale, pan te 2 varshanpasun kartayt"),
        ("assistant", "Mag bagh na! 2 varshancha experience aani 3 mahinyancha experience kasa compare honar? Tu tya timeline var ahes jithe logic building sathi vel lagto. Patience thev."),
        ("user", "mala interview madhe reject karun taktil asa vatta"),
        ("assistant", "Interviews madhe approach, communication aani basic data structures (arrays, hash maps, trees) jast matter kartat. Hard questions rare astat entry level sathi. Roz 2 questions pramanik pane kar.")
    ]))

    # 12. 12th Board Exam Relative Pressure (acad_board_exam_12th_relatives)
    convs.append(create_conv("acad_board_exam_12th_relatives", "academic_pressure", [
        ("user", "12th board chalu ahet aani aatya roz phone karun vicharte 'kasa gela paper'"),
        ("assistant", "Board exam madhe paper chya tension peksha relatives cha survey jast irritating asto! Tu phone ghenach band kela pahijes."),
        ("user", "aai phone majhyakade dete 'bol aatya shi' mhanun"),
        ("assistant", "Aai la clear sang: 'Exam sampyacha aadhi mala konashi bolaycha nahiye, concentration distract hota.' Aplya boundaries set kar, he tujha critical vel ahe.")
    ]))

    # 13. Tier 3 Campus Placements Rejection (acad_campus_tier3_rejection)
    convs.append(create_conv("acad_campus_tier3_rejection", "academic_pressure", [
        ("user", "amchya tier 3 college madhe eka company aali hoti, 3.5 LPA sathi 800 mul basle"),
        ("assistant", "800 mul aani 3.5 LPA... competition che harsh reality ahe hi. Tu short-list jhalas ka?"),
        ("user", "online assessment madhe reject jhalo, cheating kelo tyanch selection jhala"),
        ("assistant", "He khup demoralizing asta jyaveli shortcuts ghenare pudhe jatat. Pan off-campus drives aani direct referrals madhe real knowledge ch sustain karta. Swatahche projects GitHub var live kar.")
    ]))

    # 14. Student Loan Pressure (acad_financial_student_loan)
    convs.append(create_conv("acad_financial_student_loan", "academic_pressure", [
        ("user", "MBA sathi 12 lakh loan ghetla ahe aani market madhe recession chalu ahe"),
        ("assistant", "12 lakh loan cha EMI aani market slump he dohi milun motha ojha vatatay. Course madhe specialization kay ahe tujha?"),
        ("user", "Marketing aani analytics, pan campus var salary offer 6-7 LPA aaliye"),
        ("assistant", "6-7 LPA suruvatila bhetla tari loan repayment start karta yete. 2 varshat switch marun salary double hotat jar skills sharp asel tar. Don't panic.")
    ]))

    # 15. Procrastination Submission Panic (acad_procrastination_submission_panic)
    convs.append(create_conv("acad_procrastination_submission_panic", "academic_pressure", [
        ("user", "aaj ratri 12 la assignment submission ahe aani mi 1 pan page lihila nahiye"),
        ("assistant", "Arey baapre! Aata guilt madhe vel nako ghalvu. Topic kay ahe? Fast bullet points madhe structure karu."),
        ("user", "cloud computing case study ahe 15 pages chi"),
        ("assistant", "Ok, 15 pages copy-paste nako karu. 4 main headings banav: Architecture, Benefits, Security, Conclusion. Fast typing start kar, 3 tasat complete hou shakta. Phone airplane mode var tak!")
    ]))

    return convs
