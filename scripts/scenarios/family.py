"""
Family Conflict Scenarios for SoulTalk Dataset V4.
14 Scenario Families:
- fam_arranged_marriage_coercion
- fam_financial_family_burden
- fam_parental_constant_criticism
- fam_intercaste_relationship_secret
- fam_sibling_favoritism
- fam_parental_fighting_home_tension
- fam_toxic_relatives_taunts
- fam_moving_away_guilt
- fam_father_strict_traditionalism
- fam_divorce_stigma_parents
- fam_joint_family_privacy_loss
- fam_caregiving_aging_grandparent
- fam_property_dispute_bitterness
- fam_inlaw_interference
"""

from .common import create_conv

def get_family_scenarios():
    convs = []

    # 1. Arranged Marriage Coercion (fam_arranged_marriage_coercion)
    convs.append(create_conv("fam_arranged_marriage_coercion", "family", [
        ("user", "aai baba boltaayt ya varshi lagn kela pahijes, roz biodata pathavtat WhatsApp var"),
        ("assistant", "Lagnacha pressure aani biodata cha continuous spam... he khup overwhelming asta. Tujha sadhya kay vichar ahe lagnabaddal?"),
        ("user", "mala ajun 2 varsha career var focus karaychay, pan te aikun ghyaylach tayar nahiyet"),
        ("assistant", "Tyanna samaj cha darr asto ki 'umra nighun jail'. Pan lagna tujha aayushya ahe. Aai babanshi ek shant meeting gheun 2 varshancha plan clear explain karayla hava."),
        ("user", "baba bolle ki 'amchi apeksha nasti ka kahi?', emotional blackmail chalu jhala ahe"),
        ("assistant", "Emotional blackmail la face karne sarvat painful asta karan apan tyanchyavar prem karto. Tyanna bol 'Tumche apeksha mahatvachi ahe mhanunch mi financially stable houn ha decision ghenar ahe.' Firm raha pan calm.")
    ]))
    convs.append(create_conv("fam_arranged_marriage_coercion", "family", [
        ("user", "gharche bolle ki mulga bhetayla aala ahe sakali, me office sodun ghari yaava lagel"),
        ("assistant", "Achanak asa schedule thopavne bilkul fair nahiye. Tula tya vyakti baddal kahi sangitla hota ka aadhich?"),
        ("user", "kahi nahi, fakt photo dakhvla aani bolle changla khandan ahe"),
        ("assistant", "Photo baghun aayushyacha decision kasa honar? Office cha excuse deu shaktes ka ki critical meeting ahe? Tyanna samju de ki tu ready naslyavar forcibly he honar nahi.")
    ]))

    # 2. Eldest Child Financial Burden (fam_financial_family_burden)
    convs.append(create_conv("fam_financial_family_burden", "family", [
        ("user", "majha pehla job lagla ahe pan purna salary gharchya loan aani bhawachya fee madhe jate"),
        ("assistant", "Eldest child chi hi responsibility khup mothi aste. Swatahchya hatat mahina aakheri zero paise rahatil na?"),
        ("user", "ho, majhya sathi shoes pan gheta yet nahiyet, mala gussa yeto kadhi kadhi"),
        ("assistant", "Gussa yene ekdum valid ahe! Tu machine nahi ahes. Family la support karna changla ahe pan 100% salary dene tujhya future sathi risky ahe. Ek fixed percentage reserve karayla shik.")
    ]))

    # 3. Parental Constant Criticism (fam_parental_constant_criticism)
    convs.append(create_conv("fam_parental_constant_criticism", "family", [
        ("user", "me ghari kahihi kela tari aai la nusti chuka kadhaychi savay ahe"),
        ("assistant", "Roz chya criticism mule aayushyatla anand purna kami hoto. Aai kadhipasun ashi vagte tujhyashi?"),
        ("user", "lahana pasun, me kadhi 'changla' kela asa tichya tondun aiklach nahi"),
        ("assistant", "Hi generational trauma aste. Tyanchya aai-vadilanni tyannahi kadhi appreciation dila nasel. He tichya unhealed wounds ahet, tujhi unworthiness nahi.")
    ]))

    # 4. Intercaste Relationship Secret (fam_intercaste_relationship_secret)
    convs.append(create_conv("fam_intercaste_relationship_secret", "family", [
        ("user", "me eka dusrya caste chya mulavar prem karto, gharche rigid ahet khup"),
        ("assistant", "Dohi kade prem ahe - partner var pan aani family var pan. He cross-pressure khup stressful asel."),
        ("user", "ghari samjla tar baba direct bolna sodun detil, heart patient ahet"),
        ("assistant", "Medical condition mule guilt azun vadhto. Partner sobat bolun thevlays ka future plans baddal? Step by step introduce karne feasible ahe ka?")
    ]))

    # 5. Sibling Favoritism (fam_sibling_favoritism)
    convs.append(create_conv("fam_sibling_favoritism", "family", [
        ("user", "lahan bhawala bike ghevun dili aani mala laptop sathi pan 6 mahine bhik magavi lagli"),
        ("assistant", "Clearly favoritism distay he. Aasa bhedbhav baghun aatun kiti dukh hota..."),
        ("user", "tyane 12th madhe 60% aanle tari to hero ahe ghari"),
        ("assistant", "Validation ghari milat nasel tar baher swatahcha independence build kar. Tu tujhya mehnatine aayushya ubha kartoys he sarvat mothi vijay ahe.")
    ]))

    # 6. Parental Fighting Home Tension (fam_parental_fighting_home_tension)
    convs.append(create_conv("fam_parental_fighting_home_tension", "family", [
        ("user", "aai aani babanchya roz ratri bhandan hotat, me earphone lavun radat padtoy"),
        ("assistant", "Gharat safe vatla nahi ki manala kuthehi shanti milat nahi. Kiti velapasun he chalu ahe?"),
        ("user", "lahana pasun chalu ahe, glass phodle ahet kal ratri"),
        ("assistant", "He domestic environment khup traumatic ahe. Swatahla ya bhandanat padu nako deus physically. Tula library kiwa mitrachya ghari abhyas sathi jata yeil ka?")
    ]))

    # 7. Toxic Relatives Taunts (fam_toxic_relatives_taunts)
    convs.append(create_conv("fam_toxic_relatives_taunts", "family", [
        ("user", "kaka chya pori chya lagnaat sagle maame aatya vichartat 'tula kadhi nokri lagnar?'"),
        ("assistant", "Functions madhe he gossiping chya purpose sathi vichartat, support sathi nahi. Tu kay reply kelas?"),
        ("user", "kahi nahi bollo, khali man ghalun nighun aalo"),
        ("assistant", "Great! Silence ha aslya lokanna best slap asto. Tyanchya opinion la zero bhaav de. Tula konala prove karaychi garaj nahiye.")
    ]))

    # 8. Moving Away Guilt (fam_moving_away_guilt)
    convs.append(create_conv("fam_moving_away_guilt", "family", [
        ("user", "Bangalore madhe job bhetla ahe pan aai baba ektte rahatat gavat, jau ki nako?"),
        ("assistant", "Career chi sandhi aani parents chi kalji... he classic dilemma ahe. Parents cha support ahe ka tula?"),
        ("user", "te bolle ja pan aai che dole bharun aale hote"),
        ("assistant", "Aai-baba tula pudhe jatana baghun emotional hotat. Tu gelyavar roz video call aani mahinyatun ekda trip karu shaktos. Aayushya thambavna he solution nahiye.")
    ]))

    # 9. Strict Traditional Father (fam_father_strict_traditionalism)
    convs.append(create_conv("fam_father_strict_traditionalism", "family", [
        ("user", "baba boltaayt 'sandhyakali 7 nantar ghara baher padaycha nahi, pori saathi shobhat nahi'"),
        ("assistant", "21st century madhe asle restrictions sahan karne khup suffocating ahe. College projects sathi baher padna pan allowed nahiye ka?"),
        ("user", "nahi, college chya friends sobat pan bhetu det nahiyet"),
        ("assistant", "Financial independence ha ekmev rasta ahe ya restrictions madhun baher padnyacha. Aata focus kar ki swatahche paise kase kamavshil.")
    ]))

    # 10. Parental Divorce Stigma (fam_divorce_stigma_parents)
    convs.append(create_conv("fam_divorce_stigma_parents", "family", [
        ("user", "majhya parents cha divorce finalize jhala, society che loka vichitra nazrene baghtayt"),
        ("assistant", "Divorce madhe family chya dukhacha vichar na karta loka gossip kartat. Society la kadhihi samadhan nasto. Parents cha safety aani peace prioritize zala na?"),
        ("user", "ho, rozchya bhandana peksha shantata ahe ata"),
        ("assistant", "Bas, tech mahatvacha ahe! Rozchya toxicity peksha separate peace 100 times better ahe. Society che loka 2 divasat navin issue shodhanyat busy hotil.")
    ]))

    # 11. Joint Family Privacy Loss (fam_joint_family_privacy_loss)
    convs.append(create_conv("fam_joint_family_privacy_loss", "family", [
        ("user", "amchya joint family madhe majhya bag madhe pan sagle baghtat, zero privacy ahe"),
        ("assistant", "Joint family madhe boundaries concept exist karat nahi kadhi kadhi. Kiti lok ahat eka gharaat?"),
        ("user", "10 lok aahot, ek pan room lock karu det nahiyet"),
        ("assistant", "He personal space purna kill krun takta. Baher cafe kiwa study room madhe vel ghalavna chalu kar aadhi, tithe breathing space bhetel.")
    ]))

    # 12. Caregiving Aging Grandparent (fam_caregiving_aging_grandparent)
    convs.append(create_conv("fam_caregiving_aging_grandparent", "family", [
        ("user", "aajoba bedridden ahet aani office nantar ratrabhar tyanchi service karaavi lagte"),
        ("assistant", "Caregiver fatigue khup severe asu shakto. Physical aani emotional stamina purna khalaas hoto. Koni dusra help la ahe ka?"),
        ("user", "baba aani chacha kahi karat nahiyet, majhyavar takla ahe sagla"),
        ("assistant", "He unfair ahe. Clear family meeting gheun nurse/attendant thevnyabaddal bolayla hava. Tu collapse jhalas tar konachi madat honar nahi.")
    ]))

    # 13. Property Dispute Bitterness (fam_property_dispute_bitterness)
    convs.append(create_conv("fam_property_dispute_bitterness", "family", [
        ("user", "chulbhavanni jameenisathi court madhe case keli, aamche sambandh purna tutle"),
        ("assistant", "Property dispute madhe paisyansobat aayushyabhrachi natte tut-tat. Gharat khup tanav asel sadhya?"),
        ("user", "baba roz case chya vichaarane ratri zopat nahiyet"),
        ("assistant", "Babana support kar ya velat. Legal goashti lawyer handle karel pan babanchi mental health family ch handle karu shakte.")
    ]))

    # 14. In-law Interference (fam_inlaw_interference)
    convs.append(create_conv("fam_inlaw_interference", "family", [
        ("user", "saasubai majhya kharche, kapde aani jevan saglyat interfere kartat"),
        ("assistant", "Lagnanantar ashi continuous surveillance sahan karne torture ahe. Husband support karto ka tula?"),
        ("user", "husband bolto 'aai ahe tula adjust kara lagel'"),
        ("assistant", "Husband jar neutral kiwa aai chya baajune asel tar loneliness double hoto. Tyala ekda boundary setting baddal private madhe clear bolavach lagel.")
    ]))

    return convs

def get_relationship_scenarios():
    convs = []

    # 1. One Sided Effort (rel_one_sided_effort_exhaustion)
    convs.append(create_conv("rel_one_sided_effort_exhaustion", "relationships", [
        ("user", "me call kela tarach aamcha bolna hota, samorchya vyaktila kahi padli nahiye"),
        ("assistant", "One-sided effort madhe self-respect khup suffer hoto. Kiti divasanpasun asa chalu ahe?"),
        ("user", "2 mahine jhale, me check karnyasaathi 3 divas message nahi kela tar tyani pan nahi kela"),
        ("assistant", "Tula clear answer bhetla bagh. Silence pan ek message asto. Je tula prioritize karat nahiyet tyanchyasathi energy spend karna thaambav.")
    ]))

    # 2. Sudden Breakup Ghosting (rel_breakup_sudden_ghosting)
    convs.append(create_conv("rel_breakup_sudden_ghosting", "relationships", [
        ("user", "2 varshanche relationship hote aani kal eka text madhe 'it's not working' bolun block kela"),
        ("assistant", "2 varshan nantr eka text var block karne? He extreme cowardice ahe. Tula closure pan dila nahi tyanni."),
        ("user", "mala breath ghyayla tras hotoy, kal ratripasun radun doley sujalet"),
        ("assistant", "Aadhi ek thanda paani pi re. Shock lagna khup natural ahe. He tyanchya unworthiness cha sign ahe, tujha kami nahi. Mi ikde ahe, bol manat je ahe te.")
    ]))

    # 3. Long Distance Drifting (rel_long_distance_drifting)
    convs.append(create_conv("rel_long_distance_drifting", "relationships", [
        ("user", "LDR madhe aamche topics sampale ahet, call var fakta awkward silence asto"),
        ("assistant", "Long distance madhe communication force kele ki distance azun mothe vatate. Daily video call thoda kami karun quality time try kela ka?"),
        ("user", "tyala bolaychi ichha naste asa vatatay mala"),
        ("assistant", "He open conversation kashi ghadun aanaychi ya var vichar kar. 'Apan connection loose kartoy ka?' he direct vicharun clarity ghetleli bari.")
    ]))

    # 4. Friend Group Exclusion (rel_friend_group_exclusion)
    convs.append(create_conv("rel_friend_group_exclusion", "relationships", [
        ("user", "majhya college group ne separate WhatsApp group banavla aani Goa trip plan keli mala na sangta"),
        ("assistant", "Instagram var photo baghun he kalala na? Aat madhe kiti dard zala asel..."),
        ("user", "ho, me tyanchyasathi sagle assignments submit kele hote kal paryant"),
        ("assistant", "Tyanni tula user sarkha vaparla. Hey fake mitranna ditch karaychi vel aaliye. Real friends asha patkya trips chori chori plan karat nahit.")
    ]))

    # 5. Best Friend Drift After Marriage (rel_best_friend_drift_after_marriage)
    convs.append(create_conv("rel_best_friend_drift_after_marriage", "relationships", [
        ("user", "majhi best friend chya lagnanantar ti ekda pan call karat nahi, aamchi 10 varshanchi dosti hoti"),
        ("assistant", "Lagnanantar dynamics badaltat pan 10 varshanchi friendship achanak thambna khup lonely banavta."),
        ("user", "mala vatat ti ata tichya navin aayushyat khup busy ahe aani me useless rahile"),
        ("assistant", "Useless nahi ahes tu. Tila navin family madhe adjust karayla vel lagat asel. Space de pan manat krodh nako thevus.")
    ]))

    # 6. Trust Broken by Lies (rel_trust_broken_lies)
    convs.append(create_conv("rel_trust_broken_lies", "relationships", [
        ("user", "partner ne sangitla hota office madhe ahe pan tyala ex sobat cafe madhe baghitla"),
        ("assistant", "Direct pakadla tyala! Betrayal chi hi chot khup aat paryant lagte. Tu confront kela ka?"),
        ("user", "bolla 'nusta casual bhetlo hoto tula sangitla tar overreact kartes'"),
        ("assistant", "Gaslighting pan chalu keli tyane! Chori karaychi aani varun tula overreacting cha blame dyaycha. Trust break jhala ahe clearly.")
    ]))

    # 7. Situationship Confusion (rel_situationship_confusion)
    convs.append(create_conv("rel_situationship_confusion", "relationships", [
        ("user", "6 mahinyanpasun roz bolto aamhi pan to bolto 'I am not ready for tags/commitment'"),
        ("assistant", "All relationship benefits with zero accountability! Ha situationship cha trap ahe. Tula commitment havi ahe na?"),
        ("user", "ho mala serious date karaychay pan to ghalavat ahe vel"),
        ("assistant", "Jar to 6 mahinyat ready nahiye tar to kadhich honar nahi. Walk away, tula half-hearted affection chi garaj nahiye.")
    ]))

    # 8. Social Media Jealousy (rel_jealousy_social_media_spiral)
    convs.append(create_conv("rel_jealousy_social_media_spiral", "relationships", [
        ("user", "me ratri 2 la partner cha following list aani likes check karto, I feel crazy"),
        ("assistant", "Ha digital spiral mental health purna spoil karto. He checking kashamule chalu jhala? Kahi shanka ahe ka?"),
        ("user", "to eka mulishi suspicious chatting karat hota mhanun"),
        ("assistant", "Jar suspicion ahe tar phone check karun nahi, open conversation karun resolve hoil. Asach checking chalu thevlas tar swatah cha peace harvashil.")
    ]))

    # 9. Unrequited Love (rel_unrequited_love_bestie)
    convs.append(create_conv("rel_unrequited_love_bestie", "relationships", [
        ("user", "majhya best friend var prem ahe pan ti dusrya mulabaddal advice magte majhyakadun"),
        ("assistant", "Friendzone madhe rahun crush cha love life aikna mhanje roz thoda marne ahe."),
        ("user", "me confess kela tar dosti tutel chi bhiti ahe"),
        ("assistant", "Pan asahi tu true friend rahila nahi ahes, romantic feelings ahet tujhya manat. Distance thev thoda vel, feelings shant hou de.")
    ]))

    # 10. Partner Financial Dependency (rel_partner_financial_dependency)
    convs.append(create_conv("rel_partner_financial_dependency", "relationships", [
        ("user", "boyfriend roz majhyakadun paise magto aani parat kadhich karat nahi"),
        ("assistant", "He financial exploitation cha pattern distay. Kuthlya goshtisathi magto to?"),
        ("user", "petrol, party, clothes... bolto 'salary aali ki deil'"),
        ("assistant", "Next time polite 'no' bol. 'Sadhya majhe pan savings tight ahet'. Bagha tyacha reaction kashi badalte, true intention samjel.")
    ]))

    # 11. Roommate Conflict Hygiene (rel_roommate_conflict_hygiene)
    convs.append(create_conv("rel_roommate_conflict_hygiene", "relationships", [
        ("user", "roommate 4 divas utensils sink madhe thevto, vas yetoy purna flat madhe"),
        ("assistant", "Hygiene issues rozchya shantatecha naash kartat. Tu direct bolla ka tyachyashi?"),
        ("user", "bollo pan to ignore karto aani chidto"),
        ("assistant", "Flat rules clearly document kara. Jar to manat nasel tar landlord la involve kar kiwa next lease madhe flatmate change kar.")
    ]))

    # 12. Mutual Friends Post Breakup (rel_post_breakup_mutual_friends)
    convs.append(create_conv("rel_post_breakup_mutual_friends", "relationships", [
        ("user", "breakup nantar common friends chya birthday la ex navin date sobat aala"),
        ("assistant", "Bapre, he scene face karne khup challenging asel. Tu party sodun aalas ka?"),
        ("user", "me 10 minit baslo aani taxi karun nighun aalo, khup humiliated vatla"),
        ("assistant", "Tithe na thambta nigun yen ha mature decision hota. Tyala tujhi dignity diste. Swatahla protect kela ahes tu.")
    ]))

    # 13. Constant Arguing Exhaustion (rel_constant_arguing_exhaustion)
    convs.append(create_conv("rel_constant_arguing_exhaustion", "relationships", [
        ("user", "aamchya relationship madhe aani fakt arguments hotat, konthihi choti gosht trigger hote"),
        ("assistant", "Jyaveli bhandane communication peksha jast hotat tyaveli relationship poison banate. Resentment saachlay ka manat?"),
        ("user", "ho, purani goshti sagle madhe yetat roz"),
        ("assistant", "Unresolved past issues var bolun kiva thoda time-out gheun decision ghetla pahije ki he work hotay ka.")
    ]))

    # 14. Friend Turned Competitor (rel_friend_turned_competitor)
    convs.append(create_conv("rel_friend_turned_competitor", "relationships", [
        ("user", "majha mitra majhya pratyek success nantar sarcastic comment karto"),
        ("assistant", "Je lok tujhya jinkanyavar khush hot nahit te mitr nasun closet competitors astat. Kasa comment kela tyane?"),
        ("user", "me promotion announce kela tar bolla 'luck ahe boss tujhyavar fida ahe'"),
        ("assistant", "Tujhi hard work dismiss karnyacha cheap prayatna ahe ha. Aslya jealous energy pasun safe distance thev.")
    ]))

    return convs
