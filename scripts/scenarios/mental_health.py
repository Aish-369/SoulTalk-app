"""
Mental Health Scenarios for SoulTalk Dataset V4:
- Overthinking (14 scenario families)
- Self-Esteem (14 scenario families)
- Loneliness (14 scenario families)
- Social Anxiety (13 scenario families)
- Burnout (13 scenario families)

Every conversation is strictly 4, 6, or 8 turns.
"""

from .common import create_conv

def get_overthinking_scenarios():
    convs = []
    
    # 1. Midnight Existential Dread (ot_midnight_existential_dread)
    convs.append(create_conv("ot_midnight_existential_dread", "overthinking", [
        ("user", "ratri 3 vaajlet aani mala vatta mi aayushyat purna useless ahe, kahi achieve nahi kela"),
        ("assistant", "Ratri 3 vaajta brain madhe serotonin drops hotat aani existential panic triple vatato. Aata ha virodhi thought filter karava lagel. Tu aaj divasbhar thakla asashil na?"),
        ("user", "ho divasbhar screen samor hoto, pan zop yet nahiye fakt he thoughts yetayt"),
        ("assistant", "Screens mule melatonin block zala ahe. Ek kaam kar: phone ulta thev, light band kar, aani fakt thanda paani pi. Ha ratricha monster sakali 8 vaajta gayab hoil, trust me.")
    ]))
    convs.append(create_conv("ot_midnight_existential_dread", "overthinking", [
        ("user", "3 AM thought: 10 varshanantr konala majhi aathvan pan rahanar nahi, what is the point of working?"),
        ("assistant", "Midnight existential dread khup philosophical pan exhausting asta. Significance hi universal immortal frame madhe nahi, aajchya divsat konala smile dili kiwa swatahla kiti shaant thevla yaat aste. Aata zop ghene priority ahe."),
        ("user", "pan manat he vichar yetat tevha chest madhe khup empty vatata"),
        ("assistant", "Te emptiness thakva aani andhar mule jast intense vatata. Udya sakali surya ugavlyavar ha virodh shant hoil. Ek deep breath ghe aani dole band kar.")
    ]))

    # 2. Email Tone Replaying (ot_email_tone_replaying)
    convs.append(create_conv("ot_email_tone_replaying", "overthinking", [
        ("user", "boss ne mail madhe fakt 'Please see me tomorrow.' lihilay, mala heart attack yeil asa vatatay"),
        ("assistant", "Ha 4 shabdanche mail direct panic create kartat! Pan 90% veles he nusta routine project update kiwa minor query sathi asta. Tula kahi specific reason vattoy ka?"),
        ("user", "kal ek report pathavla hota tyat eka cell madhe typo zala hota"),
        ("assistant", "Eka typo sathi company konala fire karat naste re! Swatahchya manat worse-case scenario banavna band kar. Udya shantpane ja, normal bolna asel te.")
    ]))

    # 3. Future Catastrophizing (ot_future_catastrophizing)
    convs.append(create_conv("ot_future_catastrophizing", "overthinking", [
        ("user", "mala continuous vatat rahta ki udya kahi bhayanak ghadnar ahe"),
        ("assistant", "Hi anticipatory anxiety chi classic pattern ahe. Mind future threat predict karun alert mode madhe rahata. Tula sadhya safe ahes he feel hotay ka?"),
        ("user", "logical mahiti ahe safe ahe pan chest madhe tightness ahe"),
        ("assistant", "Body false danger signal detiye. Hand chest var thev. Halu halu 4 count madhe breath in kar aani 6 count madhe breath out kar. Focus physical surroundings var aan.")
    ]))

    # 4. Past Embarrassment Loop (ot_past_embarrassment_loop)
    convs.append(create_conv("ot_past_embarrassment_loop", "overthinking", [
        ("user", "5 varsha purvi college madhe stage var slip zhalo hoto te aathvun mala aata cringing hotey"),
        ("assistant", "Arey baapre, 5 varsha purvicha moment! Konala aathvat pan nasel aata te re. Tu sodun koni tya ghadnukibaddal bolla ka parat?"),
        ("user", "koni nahi, fakt majhya dokyat rewind hot rahta"),
        ("assistant", "Mind embarrassing memories archive madhe thevun random play karta. Hasa tya ghadnukivar. Tu slip jhalas, comedy jhalee, sampali goshta.")
    ]))

    # 5. Decision Paralysis (ot_decision_paralysis)
    convs.append(create_conv("ot_decision_paralysis", "overthinking", [
        ("user", "don jobs madhun ek choose karaychay, 10 sheets banavlyat pan decide hot nahiye"),
        ("assistant", "Analysis paralysis! Jyaveli don changle options astat tyaveli apan perfect choice chya shodhath stuck hoto. Donhi offers madhe base pay kiti ahe?"),
        ("user", "ekat pay jast ahe culture risky ahe, dusryat pay kami culture changla ahe"),
        ("assistant", "Tujhya ya life stage la peace havi ahe ki aggressive money? He clear asel tar answer samorch dista.")
    ]))

    # 6. Social Media Comparison (ot_social_media_comparison_trap)
    convs.append(create_conv("ot_social_media_comparison_trap", "overthinking", [
        ("user", "Instagram ughadla ki sagle Europe madhe ahet kiwa BMW ghetayt, me fakt struggle kartoy"),
        ("assistant", "Instagram highlight reel ahe, behind-the-scenes koni dakhvat nahi. Tya BMW cha 80k EMI aani loan burden status madhe nahi disat. App delete kar 3 divas sathi."),
        ("user", "pan sagle pudhe gele aani me maage rahilo asach vatat rahta"),
        ("assistant", "Pudhcha aani maagcha he fact nahi illusion ahe. Pratyekachi timeline vegli aste. Swatahchya growth var concentrate kar.")
    ]))

    # 7. Fear of Wasted Youth (ot_fear_of_regret_youth_wasted)
    convs.append(create_conv("ot_fear_of_regret_youth_wasted", "overthinking", [
        ("user", "me 25 cha jhalo aani mala vatata early twenties waste jhale lockdown aani preparation madhe"),
        ("assistant", "25 mhanje purna adult life samor padli ahe! Early twenties madhla experience waste nahi, ti foundation hoti. Navin shika, travel kara, life is just starting."),
        ("user", "friends ne goa trips kelya aani me pustakat baslo hoto"),
        ("assistant", "Tujhi discipline tula pudhchya 30s madhe strong platform deil. Trips aata kela tari aavdtil. Kahihi waste zalele nahiye.")
    ]))

    # 8. Assuming Everyone Judging (ot_assuming_everyone_judging)
    convs.append(create_conv("ot_assuming_everyone_judging", "overthinking", [
        ("user", "office cafeteria madhe entry karta mala vatta sagle majhyakade baghun judge kartayt"),
        ("assistant", "Spotlight effect boltat yaala. Reality madhe pratyek vyakti swatahchya insecurities madhe itka busy asto ki konikade dhyan dyayla vel nasto. Head up thevun ja."),
        ("user", "mala vatat majhe kapde kiwa hairstyle awkward ahe"),
        ("assistant", "Cafeteria madhe sagle jevan aani phone madhe guntlele astat. Konala tujhya hairstyle chi chinta nahiye. Confident chal!")
    ]))

    # 9. Perfectionism Block (ot_perfectionism_block)
    convs.append(create_conv("ot_perfectionism_block", "overthinking", [
        ("user", "me article lihayla ghetla ahe pan pehli line pan satisfy hot nahi mhanun backspace kartoy"),
        ("assistant", "Perfectionism is fear in fancy clothes. 'First draft always bad asto' ha niyam lakshya thev. Ugly write-up tayar kar aadhi, polish nantar karta yete."),
        ("user", "ugly lihila ki mala swatahchya standards chi laaz vatate"),
        ("assistant", "Hemingway ne pan he sangitla hota ki first draft rough asto. Edit karta yeto pan blank page edit nahi karta yet. Type kar!")
    ]))

    # 10. People Pleasing Guilt (ot_people_pleasing_guilt)
    convs.append(create_conv("ot_people_pleasing_guilt", "overthinking", [
        ("user", "colleague la Saturday shift la 'no' bollo, aakhi ratri guilt vatatey"),
        ("assistant", "Tu swatahcha weekend protect kela yaat guilt kashala? Boundary set karne he gunha nahiye. Tyanni dusra option shodhlahi asel aata."),
        ("user", "to Monday la majhyavar chidel ka?"),
        ("assistant", "Jar to professional asel tar chidnar nahi. Jar chidla, tar to tyacha problem ahe, tujha nahi. Relax!")
    ]))

    # 11. Loss of Control (ot_loss_of_control_future)
    convs.append(create_conv("ot_loss_of_control_future", "overthinking", [
        ("user", "duniyechi economy, wars, AI sagle baghun future blank vatatay"),
        ("assistant", "Macro problems var focus kelyane helplessness vadhte. Fakt tya goshtinvar control thev je tujhya room madhe ahet: tujha abhyas, skills, aani physical health."),
        ("user", "news app ughadla ki panik hoto"),
        ("assistant", "News apps algorithms engagement sathi fear sell kartat. News notifications mute kar aadhi. Real impact tujhya immediate circle madhe hoto.")
    ]))

    # 12. Worst Case Plane Travel (ot_worst_case_plane_travel)
    convs.append(create_conv("ot_worst_case_plane_travel", "overthinking", [
        ("user", "udya flight ahe aani mala plane crash che vichar yeun ulatya hotayt"),
        ("assistant", "Turbulence panic khup severe asu shakta. Statistically car drive peksha flight thousand times safer aste. Ekhada audio book download kar distraction sathi."),
        ("user", "takeoff chya veli heart rate 130 hoto majha"),
        ("assistant", "Takeoff veli headphones lavun soothing acoustic music aik. Pilot thousands of hours trained astat safety sathi.")
    ]))

    # 13. Replaying Conversation Mistakes (ot_replaying_conversation_mistakes)
    convs.append(create_conv("ot_replaying_conversation_mistakes", "overthinking", [
        ("user", "aaj meeting madhe me bollo te awkward vatla, divasbhar tohch scene replay kartoy"),
        ("assistant", "Aaplyala swatache pauses exaggerate vatatat. Baki lokanni te note pan kele nasel. Mental rewind button off kar, udya navin divas ahe."),
        ("user", "VP ne thoda smile kela hota majhya answer var"),
        ("assistant", "Smile warm asu shakte, mocking nahi. Apan anxious aslyavar har goshtila threat interpret karto. Calm down.")
    ]))

    # 14. Fear of Being Ordinary (ot_fear_of_being_ordinary)
    convs.append(create_conv("ot_fear_of_being_ordinary", "overthinking", [
        ("user", "mala bhiti vatate ki me ordinary 9 to 5 person banun marun jail"),
        ("assistant", "Ordinary mhanje peaceful aani meaningful life asu shakte. Fame aani extraordinary status madhe peace guaranteed naste. Swatahche hobbies enjoy karne ha pan success ahe."),
        ("user", "pan aamche dream hote kahi grand karaycha"),
        ("assistant", "Grandness rozchya kindness aani passion projects madhe pan aste. 9 to 5 tujha base ahe, tujha canvas khup motha ahe.")
    ]))

    return convs

def get_self_esteem_scenarios():
    convs = []

    # 1. Body Shaming Relatives (se_body_shaming_relatives)
    convs.append(create_conv("se_body_shaming_relatives", "self_esteem", [
        ("user", "kaki bolli 'kiti jaad zalis, kon lagna karel tujhyashi?', ayna baghvat nahiye"),
        ("assistant", "Itki shameless comment! Relatives na swatahche shortcomings hide karayla dusryanchya shariravar bolaychi ghaan savay aste. Tujhi worth weight var measure hot nahi."),
        ("user", "mala kharach ugly vatatay, kapde pan fit hot nahiyet"),
        ("assistant", "Sharir change hot asta life stage pramane. Tujhi beauty tujhya kindness, intelligence aani character madhe ahe. Tya kaki cha validation tula kashala hava?")
    ]))

    # 2. Imposter Fraud (se_imposter_feeling_fraud)
    convs.append(create_conv("se_imposter_feeling_fraud", "self_esteem", [
        ("user", "office madhe sagle majhi praise kartat pan mala vatta me luck mule aalo ahe"),
        ("assistant", "Imposter syndrome successful lokanna sarvat jast hoto. Luck ekda kam karu shakta, roz consistent delivery luck ne hot naste. Tujhe skills real ahet."),
        ("user", "mala vatta ek divas sagle expose kartil mala"),
        ("assistant", "Koni expose karnar nahi karan tu fraud nahi ahes! Tu kelele projects actual production madhe live ahet, te tula testify kartat.")
    ]))

    # 3. Hair Loss Balding Anxiety (se_hair_loss_balding_anxiety)
    convs.append(create_conv("se_hair_loss_balding_anxiety", "self_esteem", [
        ("user", "23 varshat hairline reseed hotiye, confidence zero zalay"),
        ("assistant", "Hair thinning mule self-esteem hit hon sahaj ahe. Dermatologist la consult kela ka finasteride kiwa minoxidil sathi? Aani lakshya thev, personality hair count peksha mothi aste."),
        ("user", "friends majak udavtat 'ganja' bolun"),
        ("assistant", "Je mitr physical features varun chidavtat te insensitive ahet. Clear sang: 'He majak mala aavdat nahi'. Aani gym karun physique build kar, bald look pan royal disto.")
    ]))

    # 4. English Speaking Inferiority (se_cannot_speak_english_fluently)
    convs.append(create_conv("se_cannot_speak_english_fluently", "self_esteem", [
        ("user", "Marathi medium shiklelo ahe mhanun corporate English meetings madhe bolayla ghabarto"),
        ("assistant", "English hi fakt bhasha ahe, intelligence nahi! Tujhya kade core domain knowledge ahe. Grammatical fluency practice ne yete. Bold pane bolayla start kar."),
        ("user", "fumble hoto aani loka madhech sentence complete kartat"),
        ("assistant", "Slow bol. Faster bolnyacha prayatna nako karu. Pauses ghetla tari authority diste, weakness nahi.")
    ]))

    # 5. Dating App Zero Matches (se_dating_app_zero_matches)
    convs.append(create_conv("se_dating_app_zero_matches", "self_esteem", [
        ("user", "Hinge aani Bumble var 1 mahina swiping keli, zero matches. Am I unlovable?"),
        ("assistant", "Dating app algorithms photo photogenicity var rely kartat, human essence var nahi. Apps var matches na milna mhanje tu unlovable ahes asa bilkul nahi. Real world madhe clubs join kar."),
        ("user", "mala vatat majhe chehra bilkul attractive nahiye"),
        ("assistant", "Apps shallow optics var chaltat. Genuine warmth, sense of humor aani integrity he face to face interactions madhech shine kartat. App un-install kar thode divas.")
    ]))

    # 6. Financial Inferiority with Peers (se_financial_inferiority_peers)
    convs.append(create_conv("se_financial_inferiority_peers", "self_esteem", [
        ("user", "friends Starbucks madhe 400 chi coffee ghetat, me tapri chaha sodun kahi afford nahi karu shakat"),
        ("assistant", "Financial backgrounds vegle astat. Tapri chaha ghene he poverty shame nahi, it's ground reality. True friends budget respect kartat. Kahi shanka nako thevu."),
        ("user", "te splitwise var bill add kartat aani mala stress yeto"),
        ("assistant", "Clear bol: 'Majha monthly budget tight ahe, mi ithe drink nahi ghenar'. Honesty builds respect, pretension breaks finances.")
    ]))

    # 7. Disliking Own Appearance (se_acne_skin_breakout_shame)
    convs.append(create_conv("se_acne_skin_breakout_shame", "self_esteem", [
        ("user", "chehryavar severe pimples aalet, camera on karun meeting attend karvat nahi"),
        ("assistant", "Acne ek medical inflammation ahe, character flaw nahi. Skin heals with proper dermatological care. Meeting madhe focus content var thev, look var nahi."),
        ("user", "aynyat baghla ki radayla yetay"),
        ("assistant", "Ayna baghna kam kara thode divas. Gentle cleanser aani prescribed medication vapra. Skin conditions temporary astat.")
    ]))

    # 8. Fear of Speaking Up (se_fear_of_speaking_up)
    convs.append(create_conv("se_fear_of_speaking_up", "self_esteem", [
        ("user", "meeting madhe majhyakade right answer hota pan me bolloch nahi karan bhiti vatli"),
        ("assistant", "Next time mic un-mute kar aani direct idea share kar. Idea fail jhali tari koi tula judge karat nahi, pan silent rahilya var credit koni dusra gheil."),
        ("user", "majh aawaj shiver hoto meeting madhe"),
        ("assistant", "Aawaj shiver jhala tari continue bol. 10 secondat shiver gayab hoto, courage rahata.")
    ]))

    # 9. Comparing Creative Work (se_comparing_creative_work)
    convs.append(create_conv("se_comparing_creative_work", "self_esteem", [
        ("user", "majhe designs baghun mala vomit vatata, Twitter var 19 varshanche pora mast 3D kartayt"),
        ("assistant", "Every master was once a disaster. Dusryanchi finish line aani swatahchi starting line compare nako karu. Roz thoda improve kar."),
        ("user", "tyanna reach pan kiti milte, majhyavar 2 likes astat"),
        ("assistant", "Social media engagement algorithms are arbitrary. Craft master kar, viral popularity fleeting aste.")
    ]))

    # 10. Constant Need for Validation (se_constant_need_for_validation)
    convs.append(create_conv("se_constant_need_for_validation", "self_esteem", [
        ("user", "post var likes nahi aale ki me delete karun takto, I feel so needy"),
        ("assistant", "External validation ha ek trap ahe jo kadhich satisfy hot nahi. Internal self-worth build kar. Tula tula banavlela content aavdla na? Bas te purasa ahe."),
        ("user", "pan lokanna nahi aavdla mhanje me fail jhalo na?"),
        ("assistant", "Nahi! Van Gogh ne jivant astana fakt 1 painting vikli hoti. Audience reaction cannot determine the intrinsic quality of your soul.")
    ]))

    # 11. Feeling Like Backup Friend (se_feeling_like_second_choice)
    convs.append(create_conv("se_feeling_like_second_choice", "self_esteem", [
        ("user", "saglyancha second choice ahe me, main plan cancel zala ki mala bolavtat"),
        ("assistant", "Stop being available for people who only remember you on cancellation. Apan swatahchi respect keli tar loka value detat. Unavailable raha."),
        ("user", "pan me refuse kela tar me purna ekta padel"),
        ("assistant", "Toxic crowd chya kinaryavar rahnyapeksha ektte asna better ahe. Navin friends bhetil je tula priority banavtil.")
    ]))

    # 12. Broken Promises to Self (se_struggling_with_discipline)
    convs.append(create_conv("se_struggling_with_discipline", "self_esteem", [
        ("user", "aaj pan sakali uthlo nahi, gym nahi gelo. I am a total failure"),
        ("assistant", "Ek divas routine miss zala mhanje 'failure' nasta. All-or-nothing mindset sod. Udya punha shant pane start kar."),
        ("user", "continuous 5 divas zale asach kartoy"),
        ("assistant", "Mag 5 am la uthnyacha rigid goal sodun 7 am cha realistic goal thev. Chote goals achieve karun trust rebuild hoil.")
    ]))

    # 13. Feeling Unworthy of Kindness (se_unworthy_of_good_things)
    convs.append(create_conv("se_unworthy_of_good_things", "self_esteem", [
        ("user", "partner khup kind ahe pan mala vatta I don't deserve this happiness"),
        ("assistant", "Past trauma mule changlya goshti suspicious vatatat. Tu prem aani kindness deserve kartos. Hesitate na karta happiness accept kar."),
        ("user", "mala vatat mi kadhitari he purna spoil karel"),
        ("assistant", "Self-sabotage chi hi tendency ahe. He vichar aale tari partner shi open bol: 'Tujhi kindness mala khup mean karte'.")
    ]))

    # 14. Identity Confusion (se_identity_confusion)
    convs.append(create_conv("se_identity_confusion", "self_esteem", [
        ("user", "mala mahitich nahiye me kharach kon ahe, fakt loka sangtat tasa vagtoy"),
        ("assistant", "Chameleon effect ahe ha - acceptance sathi swatahche roop badalna. Aata thamb aani vichar kar: koni baghat nasel tyaveli tula kay karayla aavdta?"),
        ("user", "mala painting aani solo walking aavdta pan friends boring boltat"),
        ("assistant", "Mag te friends sathi chook ahet, tujhyasathi nahi! Swatahche genuine hobbies embrace kar, tithe true self sapdel.")
    ]))

    return convs

def get_loneliness_scenarios():
    convs = []

    # 1. Weekend Silence in PG (lone_weekend_silence_pg)
    convs.append(create_conv("lone_weekend_silence_pg", "loneliness", [
        ("user", "Saturday evening ahe, PG madhe ektach ahe, phone var eka pan vyakticha message nahi"),
        ("assistant", "PG madhla ha silence khup jorat aathvato weekends la. Room madhun baher pad. Chaha pyayla tapri var ja, loka bagh. Baher chota walk pan he heaviness kami karel."),
        ("user", "walk karayla pan ichha hot nahiye, energy dead vatate"),
        ("assistant", "Just 10 minit baher pad. Shoes ghal aani road corner paryant ja. Movement brings mood change.")
    ]))

    # 2. Festival Away From Home (lone_festival_away_from_home)
    convs.append(create_conv("lone_festival_away_from_home", "loneliness", [
        ("user", "Diwali ahe aani me Bangalore flat madhe Maggi khato ahe, sagle ghari gelet"),
        ("assistant", "Festivals away from home khup painful astat. Ghari call kela ka video var? Mithai aana dukanatun, swatah sathi thoda sa festival create kar."),
        ("user", "video call var gharcha aawaj aikun azun radayla aala"),
        ("assistant", "Ghar chi aathvan yeun radna natural ahe re. Udya aazubaajuchya society celebration madhe jaun thoda lights bagh.")
    ]))

    # 3. Crowded Office Isolation (lone_crowded_office_isolation)
    convs.append(create_conv("lone_crowded_office_isolation", "loneliness", [
        ("user", "office floor var 100 lok ahet pan majhyashi bolayla koni nahi, invisible vatatay"),
        ("assistant", "Crowd madhe loneliness azun sharp vatato. Ekhadya sobat chaha coffee sathi casual approach karun bagh: 'Hey, going for coffee?' Small steps count."),
        ("user", "te already groups madhe ahet, madhe ghusna weird vatata"),
        ("assistant", "Single person sodun bhetayla bagh pantry madhe. Small talk starts with 1 person, not entire group.")
    ]))

    # 4. Eating Meals Alone (lone_eating_meals_alone)
    convs.append(create_conv("lone_eating_meals_alone", "loneliness", [
        ("user", "roz ratri mess madhe ektach jevayla jaava lagta, sagle groups madhe astat"),
        ("assistant", "Solo dining la stigma samajnyat chook ahe. Ektte jevana he independence ahe. Headphones lav, podcast aik. Koni judge karat nasto."),
        ("user", "pan loka ghureet baghtat asa vatta"),
        ("assistant", "Loka jevat astat, tyanna fakt timing cha interest asto. Swatahcha plate enjoy kar.")
    ]))

    # 5. Sick in Hostel Bed (lone_sick_in_hostel_bed)
    convs.append(create_conv("lone_sick_in_hostel_bed", "loneliness", [
        ("user", "102 fever ahe hostel room madhe, paani aanun dyayla pan koni nahiye"),
        ("assistant", "Arey re... aajarpanat gharchi khup aathvan yete. Warden la call kar lagech kiwa wing chya ekhadya mitrala bol: 'Pls get ORS and dolo'. Help magayla sankoch nako karu."),
        ("user", "shezari room cha porala sangitla, tyane dolo dili"),
        ("assistant", "Very good! Paani purna pi aani zop ghe. Shanka asel tar clinic la jaun doc la dakhav.")
    ]))

    # 6. Moving to New City (lone_moving_to_new_city)
    convs.append(create_conv("lone_moving_to_new_city", "loneliness", [
        ("user", "Hyderabad madhe shift jhalo, bhasha samajat nahiye, purna cut off feel hotay"),
        ("assistant", "New city relocation adjustment takes 3-6 months. Weekend sports group kiwa local running club join kar. Slowly familiar network build hoil."),
        ("user", "khup longing hotiye pune chi"),
        ("assistant", "Home-sickness transition cha part ahe. Hyderabadi biryani try keli ka? Navin culture explore kar, friends banayla vel lagto.")
    ]))

    # 7. Post College Gang Scatter (lone_post_college_friend_scatter)
    convs.append(create_conv("lone_post_college_friend_scatter", "loneliness", [
        ("user", "college group chat dead zalay, sagle US kiwa MNCs madhe busy zalet"),
        ("assistant", "Adult life madhe schedules diverge hotat. Ekda group video call initiate kar spontaneous pane. Nostalgia rekindle hoil."),
        ("user", "me message takla pan koni reply nahi kela 2 divas"),
        ("assistant", "Timezones aani corporate deadlines muled delay asu shakto. Don't take it personally. Navin colleagues madhe bonding shodh.")
    ]))

    # 8. Birthday Nobody Remembered (lone_birthday_nobody_remembered)
    convs.append(create_conv("lone_birthday_nobody_remembered", "loneliness", [
        ("user", "aaj majha birthday ahe, fakt HDFC bank cha automated SMS aala"),
        ("assistant", "Happy Birthday re! Manapasun wish kartoy tula. Lokanchi memory busy asu shakte pan tujhi existence precious ahe. Aaj ekhadi cake treat ghe swatah sathi."),
        ("user", "thank you yaar, he aikl nantar thoda bara vatla"),
        ("assistant", "Swatahla celebrate kar. Ek changla cinema bagh kiwa favorite meal order kar. Have a peaceful birthday!")
    ]))

    # 9. Emotional Masking (lone_emotional_masking_alone)
    convs.append(create_conv("lone_emotional_masking_alone", "loneliness", [
        ("user", "divasbhar office madhe haslo, rikshaat baslyavar achanak dole bharun aale"),
        ("assistant", "Emotional masking cha burden ahe ha. Sagle theek ahe asha pretend kelyavar battery drain hote. Radun ghe, aatli pressure release hoil."),
        ("user", "driver ne mirror madhun baghitla, khup awkward vatla"),
        ("assistant", "Driver pan human ahe, tyane pan aayushyat dukh baghitla asel. Radne is biological release, never be ashamed of it.")
    ]))

    # 10. Remote Work Cabin Fever (lone_remote_work_cabin_fever)
    convs.append(create_conv("lone_remote_work_cabin_fever", "loneliness", [
        ("user", "5 divas jhale eka pan mansashi face to face bollo nahiye, WFH trap"),
        ("assistant", "WFH cabin fever dangerous asto. Aaj laptop bag madhe ghal aani ekhadya public cafe kiwa co-working space madhe jaun kaam kar. Human presence heals."),
        ("user", "baher jaychi pan aalas aaliye ata"),
        ("assistant", "Te aalas cabin fever cha effect ahe. Face wash kar, clothes change kar aani direct baher pad. Momentum aala ki energy yete.")
    ]))

    # 11. Root Alienation (lone_growing_apart_from_roots)
    convs.append(create_conv("lone_growing_apart_from_roots", "loneliness", [
        ("user", "gavat gelyavar city person boltat, city madhe gavthi boltat, kuthlach nahi me"),
        ("assistant", "In-between identity crisis. He dohi worlds cha blend ahe tujhyat, weakness nahi. Swatahchi space create kar jithe dohi values co-exist kartat."),
        ("user", "kuthach fitting feel nahi hot"),
        ("assistant", "Fitting in is overrated, belonging starts with self-acceptance. Tu dohi cultures bridge kartoys he skill ahe.")
    ]))

    # 12. Single Status Peer Weddings (lone_single_status_peer_weddings)
    convs.append(create_conv("lone_single_status_peer_weddings", "loneliness", [
        ("user", "amchya batch madhla shevtcha single person me ahe, sagle couples astat"),
        ("assistant", "Single asna he countdown race nahiye. Wrong person sobat lagn karnya peksha right person sathi wait karna much smarter ahe."),
        ("user", "gatherings madhe sagle baby aani honeymoon boltat, me silent asto"),
        ("assistant", "Tula freedom ahe career build karaycha, travel karaycha. Pratyek phase cha anand ghe.")
    ]))

    # 13. Nobody Understands Passion (lone_nobody_understands_passion)
    convs.append(create_conv("lone_nobody_understands_passion", "loneliness", [
        ("user", "mala classical music aavdta, friends boltat 'buddhyansarkha ahe', share karayla koni nahi"),
        ("assistant", "Niche passions sathi internet communities best astat. Discord servers kiwa local concerts attend kar, tithe matching souls bhetil."),
        ("user", "live concerts madhe ektte jau ka?"),
        ("assistant", "Nakki ja! Classical concerts madhe 50% audience solo aste. Pure art lovers bhetil tithe.")
    ]))

    # 14. Silent Room After Work (lone_silent_room_after_work)
    convs.append(create_conv("lone_silent_room_after_work", "loneliness", [
        ("user", "flat chi chavi lavun aat aalo ki te silence asahya vatata"),
        ("assistant", "Aat aalyavar lagech radio, music kiwa podcast on thev. Room madhe warmth aani light create kar, lonely atmosphere disperse hoil."),
        ("user", "warm lights lavle aani lofi music chalu kelay"),
        ("assistant", "Bara vatla na? Room la hospitable banav swatah sathi. You deserve a cozy shelter.")
    ]))

    return convs

def get_social_anxiety_scenarios():
    convs = []

    # 1. Stage Trembling (sa_presentation_stage_trembling)
    convs.append(create_conv("sa_presentation_stage_trembling", "social_anxiety", [
        ("user", "udya seminar hall madhe 50 lokansamor presentation ahe, hat kaaptayt aadhich"),
        ("assistant", "Adrenaline surge mule hands shake hotat. Stage var janyachya aadhi deep belly breathing kar. Aani presentation madhe pehle 30 seconds paath karun thev, flow yeto."),
        ("user", "jar me vachayla laglo aani aawaj band padla tar?"),
        ("assistant", "Podium var paanyachi bottle thev. Pause ghe, paani pi aani continue bol. Everyone respects a brief pause.")
    ]))

    # 2. Office Party Mingling (sa_office_party_mingling)
    convs.append(create_conv("sa_office_party_mingling", "social_anxiety", [
        ("user", "office party madhe corner madhe juice glass gheun basloy, konashi bolat nahiye"),
        ("assistant", "Parties madhe mingling awkward asu shakta. Koni ektach ubha asel tar tyala casually bol: 'Too crowded here right?' 1-on-1 conversation easier aste."),
        ("user", "ek senior aale aani 'aur bhai kaisa hai' bolle, me stammer kelo"),
        ("assistant", "Senior friendly approach karat hote! Simple 'All good sir, enjoying the music' bolla tari purasa ahe.")
    ]))

    # 3. Answering Unknown Calls (sa_answering_phone_calls)
    convs.append(create_conv("sa_answering_phone_calls", "social_anxiety", [
        ("user", "unknown number varun call yetoy, chest madhe dhak dhak hota mhanun cut kela"),
        ("assistant", "Phone call phobia khup common ahe. Truecaller var check kar. Spam asel tar block kar, jar official asel tar mentally prepare houn callback kar."),
        ("user", "courier delivery wala hota shevti"),
        ("assistant", "Baghitlas! 99% calls ordinary logistic requirements sathi astat. Next time bindaas 'Hello, kon boltoy?' vichar.")
    ]))

    # 4. Subway/Counter Ordering (sa_ordering_at_busy_counter)
    convs.append(create_conv("sa_ordering_at_busy_counter", "social_anxiety", [
        ("user", "Starbucks counter var order ghol zali, sagle line madhli loka baghat hoti"),
        ("assistant", "Order ghol hona bilkul normal ahe! Barista roz ashe 100 mistakes handle karto. Loka 5 secondat visrun jatat, don't worry."),
        ("user", "mala khup shame aali"),
        ("assistant", "Coffee order karne he test nahiye. Barista ne order correct kela na shevti? Drink enjoy kar, shame sod.")
    ]))

    # 5. Small Talk in Elevator (sa_small_talk_awkward_silence)
    convs.append(create_conv("sa_small_talk_awkward_silence", "social_anxiety", [
        ("user", "VP sobat lift madhe 30 seconds silence hota, mala asahya awkward vatla"),
        ("assistant", "Awkwardness ashi exaggerated vatate! VP pan silent rahaycha enjoy karat asel. A smile or simple 'Good evening sir' is more than enough."),
        ("user", "me floor button kade baghat rahilo nusta"),
        ("assistant", "90% corporate loka techa kartat lift madhe! Don't overthink ordinary elevator rides.")
    ]))

    # 6. Blushing and Sweating (sa_fear_of_blushing_sweating)
    convs.append(create_conv("sa_fear_of_blushing_sweating", "social_anxiety", [
        ("user", "introductory round madhe majha chehra laal zala aani ghaam aala"),
        ("assistant", "Vasodilation reaction ahe he biology chi. It's human! Blushing hide karnya cha prayatna kelyavar azun vadhto. Accept it calmly."),
        ("user", "colleague bolla 'kiti laal jhalas'"),
        ("assistant", "Smile kar aani bol 'AC kami chaltoy ithe'. Lighthearted answer destroys the awkwardness.")
    ]))

    # 7. Asking Help from Store Attendant (sa_asking_for_bill_or_help)
    convs.append(create_conv("sa_asking_for_bill_or_help", "social_anxiety", [
        ("user", "supermarket madhe item bhetat navhta pan attendant la vicharaychi bhiti vatli"),
        ("assistant", "Attendant cha job ch madat karna ahe. Fakt bol: 'Excuse me, ha section kuthay?'. Two seconds of courage solves the issue."),
        ("user", "20 minit shohat rahilo shevti"),
        ("assistant", "Next time step up immediately. Ek prashna vicharlyane time aani energy dohi vachate.")
    ]))

    # 8. Entering Crowded Classroom Late (sa_walking_into_crowded_room)
    convs.append(create_conv("sa_walking_into_crowded_room", "social_anxiety", [
        ("user", "lecture la 5 minit late jhalo, darwaja ughadnyachi himmat nahi hotiye"),
        ("assistant", "Darwaja ughad, 'Excuse me sir' bol aani quietly back bench var bas. Prof chya nazarat fakt attendance record asto, judgment nahi."),
        ("user", "sagle ekdam majhyakade baghtil"),
        ("assistant", "Te 2 seconds sathi baghtil aani nantar lecture var concentration thevtil. Enter safely.")
    ]))

    # 9. Eating in Public (sa_eating_in_public_hyperawareness)
    convs.append(create_conv("sa_eating_in_public_hyperawareness", "social_anxiety", [
        ("user", "restaurant madhe khata mala vatta sagle baghtayt me kasa chavtoy"),
        ("assistant", "Public eating anxiety mule throat choke zalyasarkha vatata. Food taste var focus kar, surroundings blur out kar."),
        ("user", "spoon hand madhe shake hotoy"),
        ("assistant", "Fork spoon khali thev. Deep breath ghe. Food smell aani taste enjoy kar.")
    ]))

    # 10. Leaving Party Awkwardness (sa_saying_bye_awkwardness)
    convs.append(create_conv("sa_saying_bye_awkwardness", "social_anxiety", [
        ("user", "casual meet madhun nighthana bye kasa karava samajla nahi mhanun chupchap nighun aalo"),
        ("assistant", "The Irish Exit! He khup lok kartat awkward byes avoid karayla. Group chat var ek simple 'Had fun guys, left early' message drop kar."),
        ("user", "host offend hoil ka?"),
        ("assistant", "Friendly text pathavlas tar host khush hoil ki tu update kelas. Zero worries.")
    ]))

    # 11. Unmuted Mic Horror (sa_unmuted_mic_meeting_horror)
    convs.append(create_conv("sa_unmuted_mic_meeting_horror", "social_anxiety", [
        ("user", "townhall meeting madhe majha mic on rahila aani aai chya oradnyacha aawaj gela"),
        ("assistant", "Classic work-from-home mishap! Everyone laughs it off and relates. Slack var ek lighthearted apology lihi: 'Apologies for the background audio noise!'."),
        ("user", "manager ne ping kela 'please mute'"),
        ("assistant", "Standard reminder ahe to. Koi grudge thevat nahi asha tech glitches var.")
    ]))

    # 12. Bumping Into School Classmate (sa_bumping_into_acquaintance)
    convs.append(create_conv("sa_bumping_into_acquaintance", "social_anxiety", [
        ("user", "D-Mart madhe school friend disla, me direct dusrya aisle madhe palalo"),
        ("assistant", "Haha, grocery store evasion! It's okay, jar energy navhti small talk chi tar avoid karna human ahe. Guilt nako thevu."),
        ("user", "tyane baghitla asel ka mala?"),
        ("assistant", "Nahi baghitla asel, to vegetables tolayt busy asel. Chill kar.")
    ]))

    # 13. Joining Lunch Table (sa_joining_new_group_lunch)
    convs.append(create_conv("sa_joining_new_group_lunch", "social_anxiety", [
        ("user", "navin company madhe cafeteria table var vicharaychi bhiti vatate 'Can I sit?'"),
        ("assistant", "Fakt tray thev aani bol 'Hey, is this seat taken?'. 99% lok happily smile karun 'Sure' mhanun jaga detat."),
        ("user", "baslyavar kay bolu?"),
        ("assistant", "'Which team are you guys in?' Simple open-ended question connects everyone.")
    ]))

    return convs

def get_burnout_scenarios():
    convs = []

    # 1. Chronic Exhaustion (bo_chronic_exhaustion_waking_tired)
    convs.append(create_conv("bo_chronic_exhaustion_waking_tired", "burnout", [
        ("user", "9 taas zoplo tari sakali uthun asha vatata ki angaat zero energy ahe"),
        ("assistant", "Physical sleep purashi asun pan jar soul thakleli asel tar tired vatata. He deep mental burnout cha sign ahe. Tu break ghetlays ka kadhi?"),
        ("user", "1 varshat ek pan chutti ghetleli nahiye"),
        ("assistant", "He clear depletion ahe! Shariralar rest havay. Pudhchya Monday kiwa Friday leave apply kar aani long weekend aaram kar.")
    ]))

    # 2. Loss of Creative Spark (bo_loss_of_creative_spark)
    convs.append(create_conv("bo_loss_of_creative_spark", "burnout", [
        ("user", "me graphic designer ahe pan Photoshop open karaychi revulsion vatatey"),
        ("assistant", "Creative burnout hits hard. Passion jithe obligation banate tithe block yeto. 3 divas digital tools pasun purna detached raha, nature bagh."),
        ("user", "clients deadlines pending ahet"),
        ("assistant", "Basic minimum deliver kar without creative overthinking. Refueling zhalyashivay inspiration yenar nahi.")
    ]))

    # 3. Emotional Numbness (bo_emotional_numbness_apathy)
    convs.append(create_conv("bo_emotional_numbness_apathy", "burnout", [
        ("user", "changla ghadla tari anand hot nahi, vaait ghadla tari dukh hot nahi, I feel completely flat"),
        ("assistant", "Depletion stage ahe hi. Overload pasun protect karayla mind emotions shut down karta. Unplug kara, expectations 0 var theva thoda divas."),
        ("user", "mala vatat mi robot banloy"),
        ("assistant", "Robot nahi, exhausted human ahes. Energy replenish zhali ki emotional range parat yete.")
    ]))

    # 4. Night Job Day Study (bo_juggling_night_job_day_study)
    convs.append(create_conv("bo_juggling_night_job_day_study", "burnout", [
        ("user", "BPO night shift kartoy aani dupari MPSC classes, sharir break down hotay"),
        ("assistant", "He schedule physiologically unsustainable ahe. Sleep deprivation irreversible health issues create karel. Ek priority choose karavi lagel."),
        ("user", "paise pan have ahet aani exam pan"),
        ("assistant", "Part-time freelancing kiwa day-shift support madhe swap kar. Night shift sobat competitive exam crack karna body crumble karel.")
    ]))

    # 5. Weekend Overtime (bo_constant_overtime_weekends)
    convs.append(create_conv("bo_constant_overtime_weekends", "burnout", [
        ("user", "lagatar 4th weekend ahe me production release fix kartoy, domestic life collapsed"),
        ("assistant", "Overtime exploitation stops only when you push back. Direct escalate to delivery manager: 'Need compensatory off, continuous 28 days working unsustainable'."),
        ("user", "manager bolto 'critical client ahe'"),
        ("assistant", "Every project is critical according to management. Jar employee collapse zala tar client kaam nahi deil. Set boundary.")
    ]))

    # 6. Caregiver Fatigue (bo_caregiver_compassion_fatigue)
    convs.append(create_conv("bo_caregiver_compassion_fatigue", "burnout", [
        ("user", "depressed mitrala 6 mahinyanpasun support kartoy, ata majhi swatahchi battery dead ahe"),
        ("assistant", "You cannot pour from an empty cup. Mitra la professional helpline (14416) recommend kar. Tujhi responsibility support ahe, swatahla drain karna nahi."),
        ("user", "tyala ekta sodla tar guilt yeto"),
        ("assistant", "Professional help is real care, not your personal exhaustion. Introduce him to helpline resources.")
    ]))

    # 7. Inability to Concentrate (bo_inability_to_concentrate)
    convs.append(create_conv("bo_inability_to_concentrate", "burnout", [
        ("user", "eka 1-page document vachayla 1 taas lagtoy, brain foggy zalay purna"),
        ("assistant", "Cognitive exhaustion. Stop reading. Screen band kar, baher fresh air madhe 20 minit walk kar. Brain reset zalyashivay focus yenar nahi."),
        ("user", "deadline aaj 5 PM chi ahe"),
        ("assistant", "20 minit walk ghe aani water hydration. Refreshing reset deadline meet karayla madat karel.")
    ]))

    # 8. Physical Symptoms (bo_physical_stress_manifestations)
    convs.append(create_conv("bo_physical_stress_manifestations", "burnout", [
        ("user", "roz ratri daat chavun jaw pain hoto aani continuous acid reflux ahe"),
        ("assistant", "Bruxism aani acidity he stress che direct somatic signals ahet. Sharir alarm bajavtay! Work boundaries enforce kar lagech."),
        ("user", "doctor ne pan stress manage karayla sangitlay"),
        ("assistant", "Doctor cha salla serious ghe. Evening walks, light dinner aani screen cutoff enforce kar.")
    ]))

    # 9. Cynicism (bo_cynicism_towards_career)
    convs.append(create_conv("bo_cynicism_towards_career", "burnout", [
        ("user", "amche corporate KPIs kiti bogus ahet vichar yeto, kahich meaning nahiye"),
        ("assistant", "Cynicism burnout cha core component ahe. Detach from corporate identity. Life chi meaning hobbies aani relationships madhe shodh."),
        ("user", "sagla futile vatata"),
        ("assistant", "Job earns living, life happens outside office. Rediscover creative non-work activities.")
    ]))

    # 10. Guilt When Resting (bo_guilt_when_resting)
    convs.append(create_conv("bo_guilt_when_resting", "burnout", [
        ("user", "Sunday la bed var padlo tari Slack notifications baghat rahto with severe guilt"),
        ("assistant", "Rest is a biological requirement, not a reward you have to earn. Turn off Slack notifications on weekends. Protect your downtime."),
        ("user", "urgent issue aala tar?"),
        ("assistant", "If it's truly urgent, they will call on phone. Slack notifications off thev.")
    ]))

    # 11. Freelance Overbooking (bo_freelance_overbooking_trap)
    convs.append(create_conv("bo_freelance_overbooking_trap", "burnout", [
        ("user", "paishyanchya bhitine 4 clients che projects ghetle, ata 4 deadlines miss hotayt"),
        ("assistant", "Fear-driven overbooking! Subcontract 1-2 projects to another trusted freelancer kiwa clients kadun extension request kar with honest timeline."),
        ("user", "clients chidtil"),
        ("assistant", "Missing deadline quietly makes them angrier than early professional communication with honest timeline.")
    ]))

    # 12. Startup Founder Collapse (bo_startup_founder_collapse)
    convs.append(create_conv("bo_startup_founder_collapse", "burnout", [
        ("user", "2 varshanpasun 80 hours a week kartoy, runway sampat aali aani me sick ahe"),
        ("assistant", "Founder burnout can be fatal for both health and startup. Pause for 48 hours. Clear mind provides better strategic decisions than exhausted hustle."),
        ("user", "investor update pathavaycha ahe"),
        ("assistant", "Send transparent update. Investors respect sustainable leadership over erratic breakdown.")
    ]))

    # 13. Semester End Crash (bo_academic_semester_end_crash)
    convs.append(create_conv("bo_academic_semester_end_crash", "burnout", [
        ("user", "final exams aani submission nantar ghari aalo aani 3 divas zopun pan fresh vatat nahiye"),
        ("assistant", "Adrenaline drop nantar post-exam collapse hoto. Sharirala real recovery sathi 1-2 athavde lagtat. Allow yourself to do absolutely nothing."),
        ("user", "gharche boltat 'aalsi ahes uth'"),
        ("assistant", "Tyanna samjav: 'Intense mental exhaustion nantar brain rest magto'. You will bounce back soon.")
    ]))

    return convs
