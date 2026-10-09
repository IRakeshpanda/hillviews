import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useLocation, Link } from 'react-router-dom';

export function useTermsScrollSpy() {
  const [activeId, setActiveId] = useState("section-1");
  const isClickingRef = useRef(false);
  const clickTimeoutRef = useRef(null);

  // 1. Function to handle manual click selection
  const handleLinkClick = (id) => {
    isClickingRef.current = true;
    setActiveId(id);

    // Re-enable scroll spy after scroll animation completes (800ms buffer)
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    clickTimeoutRef.current = setTimeout(() => {
      isClickingRef.current = false;
    }, 850);
  };

  useEffect(() => {
    const sectionIds = [
      "section-1", "section-2", "section-3", "section-4", "section-5",
      "section-6", "section-7", "section-8", "section-9", "section-10",
      "cancellation", "section-12", "section-13", "section-14", "section-15",
      "section-16", "section-17", "section-18", "section-19"
    ];

    const handleScroll = () => {
      // If user just clicked a sidebar link, respect the click selection
      if (isClickingRef.current) return;

      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Bottom-of-page check: prioritize late sections when near bottom
      const isNearBottom = scrollPosition + windowHeight >= documentHeight - 120;

      if (isNearBottom) {
        // Find whichever section among 17, 18, 19 is most visible
        const bottomIds = ["section-19", "section-18", "section-17", "section-16"];
        for (const id of bottomIds) {
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top < windowHeight * 0.85) {
              setActiveId(id);
              return;
            }
          }
        }
      }

      // Standard view-trigger for all other sections
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Triggers when section top crosses upper 35% of the viewport
          if (rect.top <= windowHeight * 0.35) {
            setActiveId(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
  }, []);

  return { activeId, handleLinkClick };
}

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function TermsPage() {
  const containerRef = useRef(null);
  const location = useLocation();
  const { activeId, handleLinkClick } = useTermsScrollSpy();

  useGSAP(() => {
    const sections = gsap.utils.toArray(".term-card, #cancellation");

    // Fade up entrance animation for sections
    gsap.from(sections, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.1,
      scrollTrigger: {
        trigger: ".terms-content",
        start: "top 80%"
      }
    });

    // Handle initial hash navigation
    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.replace('#', '');
        const target = document.getElementById(id);
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 100, // Account for sticky nav and padding
            behavior: 'smooth'
          });
          // Highlight animation for cancellation block if targeted
          if (id === 'cancellation') {
            gsap.fromTo(target, 
              { boxShadow: "0 0 0 0 rgba(16, 185, 129, 0.7)" },
              { boxShadow: "0 0 0 20px rgba(16, 185, 129, 0)", duration: 1.5, ease: "power2.out" }
            );
          }
        }
      }, 500); // small delay to ensure DOM is ready and animations are set
    }
  }, { scope: containerRef, dependencies: [location.hash] });

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 100, 
        behavior: 'smooth'
      });
      window.history.pushState(null, '', `#${id}`);
    }
  };

  const navLinks = [
    { id: "section-1", label: "01. Definitions" },
    { id: "section-2", label: "02. General Terms" },
    { id: "section-3", label: "03. Booking Procedure" },
    { id: "section-4", label: "04. Prices & Payment" },
    { id: "section-5", label: "05. Security Deposit" },
    { id: "section-6", label: "06. Your Obligations" },
    { id: "section-7", label: "07. Our Liability & Owner's" },
    { id: "section-8", label: "08. Access to Property" },
    { id: "section-9", label: "09. Complaints" },
    { id: "section-10", label: "10. Alterations to Booking" },
    { id: "cancellation", label: "⭐ 11. Cancellation Policy" },
    { id: "section-12", label: "12. Alterations by Us" },
    { id: "section-13", label: "13. Non-Availability" },
    { id: "section-14", label: "14. Dog & Pet Policy" },
    { id: "section-15", label: "15. Accuracy" },
    { id: "section-16", label: "16. Privacy Policy" },
    { id: "section-17", label: "17. The Law" },
    { id: "section-18", label: "18. Entire Agreement" },
    { id: "section-19", label: "19. Questions & Complaints" },
  ];

  return (
    <main ref={containerRef} className="min-h-screen bg-white pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <header className="mb-16 md:mb-20 max-w-3xl">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-neutral-400 font-semibold mb-3 animate-fadeIn">
            <span className="inline-block w-2 h-2 rounded-full bg-neutral-900"></span>
            <span>LEGAL GOVERNANCE -  ENGLISH LAW</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-neutral-900 leading-tight animate-slideUp">
            Booking Terms & Conditions
          </h1>
          <p className="mt-4 text-base md:text-lg leading-relaxed text-neutral-600 animate-slideUp" style={{ animationDelay: '0.1s' }}>
            These terms form the contractual agreement between you and Robert Smith (Owner/Operator of Hill View, Low Row, Swaledale). Please review all clauses, security deposit standards, and cancellation timelines prior to reservation.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 text-xs font-mono text-neutral-600 border border-neutral-200/60 animate-slideUp" style={{ animationDelay: '0.2s' }}>
            <span>Contract Version: 2026.1 -  Complete Unabridged Text</span>
          </div>
        </header>

        {/* TWO-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start terms-content">
          
          {/* STICKY SIDEBAR (19 Discrete Section Links) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-28 space-y-4">
            <div className="p-6 rounded-3xl bg-[#FBFBFA] border border-neutral-200/80">
              <h3 className="text-xs uppercase tracking-widest font-bold text-neutral-400 mb-4">
                Table of Clauses
              </h3>
              <nav className="space-y-1 text-xs font-medium max-h-[65vh] overflow-y-auto pr-2 no-scrollbar">
                {navLinks.map((item) => {
                  const isActive = activeId === item.id;
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => {
                        handleLinkClick(item.id);
                        scrollToSection(e, item.id);
                      }}
                      className={`block py-1.5 px-3 rounded-lg transition-all ${
                        isActive
                          ? "bg-neutral-900 text-white font-semibold shadow-sm"
                          : "text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100"
                      }`}
                    >
                      {item.label}
                    </a>
                  );
                })}
              </nav>
            </div>

            <div className="p-6 rounded-3xl bg-neutral-100 border border-neutral-200/80 text-xs text-neutral-600 space-y-2">
              <p className="font-semibold text-neutral-900">Direct Contact Details:</p>
              <p>Robert Smith -  <a href="mailto:robert_smith@sky.com" className="underline font-medium text-neutral-900">robert_smith@sky.com</a> -  <a href="tel:+41795489771" className="underline font-medium text-neutral-900">+41 79 548 9771</a></p>
            </div>
          </aside>

          {/* RIGHT COLUMN: FULL UNABRIDGED CLAUSES (1–19) */}
          <div className="lg:col-span-8 space-y-12 max-w-[720px]">

            {/* 1. DEFINITIONS */}
            <section id="section-1" className="term-card pt-6 border-t border-neutral-200/70">
              <span className="text-xs font-mono font-semibold text-neutral-400 uppercase tracking-widest">01</span>
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1 mb-4">1. Definitions</h2>
              <div className="space-y-2.5 text-sm md:text-base leading-relaxed text-neutral-600">
                <p><strong>1.1 ‘We’, ‘Us’, ‘Our’:</strong> Robert Smith.</p>
                <p><strong>1.2 ‘You’:</strong> The person who makes the booking and enters their name and address into Hill View, Low Row Holidays online booking system or gives this information over the phone when making a telephone booking.</p>
                <p><strong>1.3 Owner:</strong> The owner of the Property or their representative.</p>
                <p><strong>1.4 Property:</strong> The property referred to in the booking confirmation.</p>
                <p><strong>1.5 Terms:</strong> The terms referred to in this document and any other terms given to you by Us or the Owner.</p>
                <p><strong>1.6 Accommodation:</strong> The accommodation provided to you at the Property for a set period detailed out in your Booking and agreed by Us.</p>
                <p><strong>1.7 Booking:</strong> Your request for accommodation made through Our online booking portal or over the telephone.</p>
                <p><strong>1.8 Check-in date:</strong> The date and time at which your accommodation booking begins at the Property.</p>
                <p><strong>1.9 ‘In Writing’ or ‘Written’:</strong> Includes correspondence via email unless we state otherwise.</p>
              </div>
            </section>

            {/* 2. GENERAL TERMS */}
            <section id="section-2" className="term-card pt-6 border-t border-neutral-200/70">
              <span className="text-xs font-mono font-semibold text-neutral-400 uppercase tracking-widest">02</span>
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1 mb-4">2. General Terms and Conditions</h2>
              <div className="space-y-3 text-sm md:text-base leading-relaxed text-neutral-600">
                <p><strong>2.1</strong> You must be 18 years of age or over when the booking is made.</p>
                <p><strong>2.2</strong> The Owner reserves the right to refuse the booking for any lawful reason.</p>
                <p><strong>2.3</strong> You may occupy the Property solely for the purpose of a holiday (as defined in the Housing Act 1988, Schedule 1, Paragraph 9) and it is understood that no assured shorthold tenancy, statutory periodic tenancy, or any other type of tenancy will arise other than a holiday letting.</p>
              </div>
            </section>

            {/* 3. BOOKING PROCEDURE */}
            <section id="section-3" className="term-card pt-6 border-t border-neutral-200/70">
              <span className="text-xs font-mono font-semibold text-neutral-400 uppercase tracking-widest">03</span>
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1 mb-4">3. Booking Procedure</h2>
              <div className="space-y-3 text-sm md:text-base leading-relaxed text-neutral-600">
                <p><strong>3.1</strong> Bookings are made via Our website booking portal or via the telephone.</p>
                <p><strong>3.2</strong> All bookings remain provisional until payment has been received in cleared funds through our online payment system or over the telephone. Unless payment has been made within 48 hours of making the provisional booking (unless alternative arrangements have been made), the provisional booking will be treated as cancelled.</p>
                <p><strong>3.3</strong> Bookings are classed as provisional until all payments due at this time are paid (see 3.2). We will confirm in writing the booking with you. At the point we confirm the booking in writing a contract is formed between you and Us. Contact us immediately if any information which appears on the booking confirmation is incorrect or incomplete.</p>
              </div>
            </section>

            {/* 4. PRICES AND PAYMENT */}
            <section id="section-4" className="term-card pt-6 border-t border-neutral-200/70">
              <span className="text-xs font-mono font-semibold text-neutral-400 uppercase tracking-widest">04</span>
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1 mb-4">4. Prices and Payment</h2>
              <div className="space-y-3 text-sm md:text-base leading-relaxed text-neutral-600">
                <p><strong>4.1</strong> Our quoted prices are per Property for accommodation only and include (where applicable) VAT, cleaning on departure, bed linen and towels, electricity, gas, water, central heating. Please refer to the Property description for any additional charges, such as for logs or dogs. Beach towels and cot linen are not included, unless otherwise stated in the Property description.</p>
                <p><strong>4.2</strong> Payments can be made in UK sterling by bank transfer, by credit or debit card.</p>
              </div>
            </section>

            {/* 5. SECURITY DEPOSIT (FULL 5.1 TO 5.15) */}
            <section id="section-5" className="term-card pt-6 border-t border-neutral-200/70">
              <span className="text-xs font-mono font-semibold text-neutral-400 uppercase tracking-widest">05</span>
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1 mb-4">5. Security Deposit</h2>
              <div className="space-y-3 text-sm md:text-base leading-relaxed text-neutral-600">
                <p><strong>5.1</strong> A security deposit is required to cover the cost of any damage or breakages to or at the Property, its contents or grounds, any additional cleaning required over the time allowed for a standard departure clean, replacement of lost or non-returned keys (and replacement of locks if necessary), a penalty fee and the cost of professionally cleaning the soft furnishings where the no smoking rule has been ignored, replacement of soiled mattresses, call out charges incurred by guests, late departure or early arrival (if not agreed), over occupancy of guests or pets, or taking pets into a Property that does not permit pets.</p>
                <p><strong>5.2</strong> We will inform you at time of making the booking of the amount of the security deposit. Our usual deposit is £200 per property.</p>
                <p><strong>5.3</strong> An enhanced refundable security deposit may be required for certain types of booking including events, large parties, and group single sex bookings (where they have been permitted by the Owner).</p>
                <p><strong>5.4</strong> The security deposit will be pre-authorised against the credit or debit card used to pay the deposit or balance of the booking unless you inform us otherwise and provide us with alternative debit or credit card details.</p>
                <p><strong>5.5</strong> If you pay by bank transfer, credit or debit card details for the security deposit must be provided at time of payment. You agree to us holding your card details for the purpose of payment of the security deposit or any part of it or for any additional sums which are payable by you in accordance with paragraphs 5.9 – 5.12 below.</p>
                <p><strong>5.6</strong> If you fail to provide credit or debit card details for the security deposit on request, we reserve the right to treat the booking as cancelled whereupon our standard cancellation terms will apply (see paragraph 11 below).</p>
                <p><strong>5.7</strong> The credit or debit card provided in respect of the security deposit must be valid for a month after the booking departure date.</p>
                <p><strong>5.8</strong> The Owner or their representative will inspect the Property after your departure.</p>
                <p><strong>5.9</strong> You will only be notified if there is a reason to charge any proportion of the security deposit.</p>
                <p><strong>5.10</strong> We will notify you of any damage or breakages noted along with images provided by the Owner (where applicable) within 10 working days of your departure from the Property. Charges up to the value of £50 are at the discretion of the Owner. In the event of minor breakages (e.g. glasses), the item(s) should be replaced like for like or cash left for replacement.</p>
                <p><strong>5.11</strong> The costs referred to above will be charged to your credit or debit card which we hold for the security deposit.</p>
                <p><strong>5.12</strong> If the security deposit specified at time of booking is not sufficient to cover the costs referred to above, we will charge the full amount of the security deposit and the balance over and above this sum to your credit or debit card on the date that is 14 days after the amount has been notified to you.</p>
                <p><strong>5.13</strong> If there is a delay in obtaining an invoice (for instance if repairs are involved), we will charge the security deposit or a proportion of it and will refund any excess to your debit or credit card once the final invoice is received from the Owner.</p>
                <p><strong>5.14</strong> We will liaise with you and the Owner and seek to resolve any security deposit issues within four weeks following your departure from the Property unless there is a dispute between you and the Owner over damage or we are awaiting bills/proof of damage from the Owner.</p>
                <p><strong>5.15</strong> We reserve the right to charge a discretionary administrative charge of up to £50 including VAT for handling security deposit claims.</p>
              </div>
            </section>

            {/* 6. YOUR OBLIGATIONS (FULL 6.1 TO 6.12) */}
            <section id="section-6" className="term-card pt-6 border-t border-neutral-200/70">
              <span className="text-xs font-mono font-semibold text-neutral-400 uppercase tracking-widest">06</span>
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1 mb-4">6. Your Obligations</h2>
              <div className="space-y-3 text-sm md:text-base leading-relaxed text-neutral-600">
                <p><strong>6.1</strong> You must arrive and depart within the check-in and check-out times stipulated for the Property unless special arrangements have been agreed in advance. Failure to check out on time may result in a charge of £50 being made to your security deposit.</p>
                <p><strong>6.2</strong> You must keep the Property and all furniture, fittings, facilities, equipment, and grounds in the same condition as at the date of your arrival and in the same state of general order in which they were found. We reserve the right to make a deduction from your security deposit for any additional cleaning required over the usual number of hours committed to departure cleaning.</p>
                <p><strong>6.3</strong> Mattresses are checked after every booking. In the event of a mattress being soiled, you will be charged for a new mattress or sanitisation if the latter is viable.</p>
                <p><strong>6.4</strong> You will be charged for the cost of replacing bed linen and towels with permanent staining including those from fake tan or make up.</p>
                <p><strong>6.5</strong> All the properties are strictly no smoking and if you fail to observe this prohibition you will be charged a penalty in addition to the cost for the cleaning of soft furnishings and any other additional cleaning required to remove all traces of smoke from the Property.</p>
                <p><strong>6.6</strong> You must promptly report to the Owner or Us any breakages or damage and you will be responsible for payment of any breakages, loss, or damage to the Property and/or its grounds or contents caused by you. In the event of minor breakages (e.g. glasses), the item(s) should be replaced like for like or cash left for replacement.</p>
                <p><strong>6.7</strong> You are responsible for the neighbourly and appropriate behaviour of your party. Should you or a member of your party abuse the Property or display dangerous, disrespectful, offensive or rude behaviour to our representatives or any third parties (e.g. neighbours), undertake any illegal activity, or any activity which may cause damage, or unreasonable noise or disturbance we and the Owner reserve the right to require the person(s) concerned to leave the Property.</p>
                <p><strong>6.8</strong> You are responsible for you and your party maintaining acceptable levels of noise at the Property and within the grounds and vicinity of the Property particularly between the hours of 10.00pm and 8.00am. In the event of you or any member of your party breaching this responsibility, we reserve the right to ask you to vacate the Property immediately.</p>
                <p><strong>6.9</strong> Any changes to your party should be notified to us. In addition, you must not exceed the maximum number of guests permitted to occupy the Property as stated in your booking confirmation, exceed the maximum number of guests the Property accommodates or sublet the Property without notifying us so that we may seek the consent of the Owner whose consent may be subject to additional terms and conditions.</p>
                <p><strong>6.10</strong> If you intend to organise a function (e.g. party, wedding or other event) at the Property, you must seek prior permission from us. A facility fee and an increased security deposit may apply at the Owner’s discretion.</p>
                <p><strong>6.11</strong> You must adhere to the policy on pets set out in paragraph 14 below. Dogs are welcome at properties marketed as dog-friendly, but you must not exceed the number of dogs allowed in the Property unless with prior agreement of the Owner. Maximum 2 dogs allowed (Unless otherwise agreed or stated within the individual property details).</p>
                <p><strong>6.12</strong> In the event of any breach of the obligations of this paragraph 6 you may be asked to vacate the Property and in these circumstances the booking contract will come to an end immediately without any refund of payments made by you or any compensation for early termination. You will be liable for any costs or damages stipulated in these Booking Terms and Conditions caused by your breach and such costs and damages can be charged to the security deposit.</p>
              </div>
            </section>

            {/* 7. OUR LIABILITY AND THAT OF THE OWNER (FULL 7.1 TO 7.9) */}
            <section id="section-7" className="term-card pt-6 border-t border-neutral-200/70">
              <span className="text-xs font-mono font-semibold text-neutral-400 uppercase tracking-widest">07</span>
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1 mb-4">7. Our Liability and That of the Owner</h2>
              <div className="space-y-3 text-sm md:text-base leading-relaxed text-neutral-600">
                <p><strong>7.1</strong> Neither We nor the Owner excludes or limits in any way our liability to you where it would be unlawful to do so. This includes liability for death or personal injury caused by Our or the Owner’s negligence or the negligence of our employees, agents, or subcontractors; for fraud or fraudulent misrepresentation; or for breach of your legal rights in relation to the booking contract. However, we do not accept liability for any loss, damage, injury, or death howsoever caused to you (or anyone in your party) or to your vehicles or personal Property in circumstances where neither We nor the Owner have been negligent. Any valuables left at the Property are left at your own risk. It is your responsibility to ensure that all doors, shutters, and windows are closed and locked when leaving the Property or when in the grounds. You should take out adequate travel insurance (including liability for accidental damage to the Property, cancellation cover and medical and emergency expenses) prior to the commencement of your holiday.</p>
                <p><strong>7.2</strong> Children within your party should be always monitored by you and it is your sole responsibility to check the suitability of any children’s equipment which is provided at the Property as neither we nor the Owner can accept any responsibility for its use.</p>
                <p><strong>7.3</strong> Neither we nor the Owner is responsible for noise or disturbance originating beyond the boundaries of the Property.</p>
                <p><strong>7.4</strong> Neither we nor the Owner can be responsible for the failure or interruption of the supply of water, gas, electricity or broadband to the Property or the removal of wastewater from the Property or for the breakdown of domestic and mechanical equipment such as heating or plumbing systems, boilers. In such circumstances, the Owner will take all reasonable steps to reinstate the supply or service or repair any equipment as soon as practicable.</p>
                <p><strong>7.5</strong> Broadband is provided, although no responsibility is accepted for any failure of the service, nor can a minimum speed be guaranteed, particularly as Low Row is a rural area.</p>
                <p><strong>7.6</strong> We inspect the Property at least annually however we cannot accept any liability for any misrepresentation by the Owner or any changes made by the Owner without our knowledge following our last inspection.</p>
                <p><strong>7.7</strong> All bookings and other arrangements made by us on your behalf with third parties (e.g. catering services) are subject to the terms and conditions imposed by those third parties. We do not take any commission for introducing you to such third parties or their services nor do we act as an agent on their behalf and in such circumstances, we do not accept responsibility for these third parties or the services they provide.</p>
                <p><strong>7.8</strong> Neither we nor the Owner are responsible for any loss or damage that is not foreseeable. Loss or damage is foreseeable if either it is obvious that it will happen or if, at the time the booking was made, both we and you knew it might happen.</p>
                <p><strong>7.9</strong> Neither we nor the Owner can accept liability or pay any compensation where performance of our obligations to you is affected or prevented by, or you otherwise suffer any damage, loss, or expense of any nature because of force majeure.</p>
              </div>
            </section>

            {/* 8. ACCESS TO THE PROPERTY (SEPARATE) */}
            <section id="section-8" className="term-card pt-6 border-t border-neutral-200/70">
              <span className="text-xs font-mono font-semibold text-neutral-400 uppercase tracking-widest">08</span>
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1 mb-4">8. Access to the Property</h2>
              <div className="space-y-3 text-sm md:text-base leading-relaxed text-neutral-600">
                <p><strong>8.1</strong> We, The Owner or our representatives have a right to access the property at any reasonable time during your stay to carry out essential maintenance or undertake essential checks. We will endeavour to give reasonable notice to you. Gardeners and maintenance staff may also enter the grounds during your stay but will try as best as possible to not interfere with your enjoyment of the Property.</p>
              </div>
            </section>

            {/* 9. COMPLAINTS (SEPARATE & FULL 9.1 TO 9.4) */}
            <section id="section-9" className="term-card pt-6 border-t border-neutral-200/70">
              <span className="text-xs font-mono font-semibold text-neutral-400 uppercase tracking-widest">09</span>
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1 mb-4">9. Complaints</h2>
              <div className="space-y-3 text-sm md:text-base leading-relaxed text-neutral-600">
                <p><strong>9.1</strong> In the event that a complaint arises whilst you are on holiday you should first contact the housekeeper or owner promptly (Their Details Will Be Found in The Property Information Book) to allow them an opportunity to rectify the matter. This <strong>MUST</strong> be whilst you are still resident at the property. A complaint not reported until after you return home will not be considered as, by then, you will appreciate it will be difficult to investigate and/or have the opportunity to rectify. If the problem is not resolved to your satisfaction, please contact us immediately. It is important that this procedure is followed to allow us the opportunity to investigate the complaint during your holiday.</p>
                <p><strong>9.2 Force Majeure:</strong> In the event of failure of services or facilities at the hired property which are outside of the owners or agents control (e.g. Electricity, Gas, Water, broadband connectivity, TV signal etc.), the agent or owner will not be held responsible or liable in full or part for refund or compensation.</p>
                <p><strong>9.3</strong> In the unlikely event that any problem is not resolved to your satisfaction during your holiday, you should send us written details of your concerns by email or letter within seven days of your return.</p>
                <p><strong>9.4</strong> We cannot accept complaints unless this procedure is followed. Complaints received after your holiday will not be accepted if we have not had prior notification of them and been given the opportunity to put matters right.</p>
              </div>
            </section>

            {/* 10. ALTERATIONS TO A BOOKING */}
            <section id="section-10" className="term-card pt-6 border-t border-neutral-200/70">
              <span className="text-xs font-mono font-semibold text-neutral-400 uppercase tracking-widest">10</span>
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1 mb-4">10. Alterations to a Booking</h2>
              <div className="space-y-3 text-sm md:text-base leading-relaxed text-neutral-600">
                <p><strong>10.1</strong> A booking can only be transferred to another Property by treating the original booking as a cancellation and the terms at paragraph 11 will apply.</p>
                <p><strong>10.2</strong> The dates of a booking may be changed providing the Property is available for the new dates and the Owner accepts the new booking. Any difference in price must be met by you or will be refunded to you on confirmation of the new booking. Otherwise, the original booking will be treated as a cancellation and the terms at paragraph 11 will apply.</p>
              </div>
            </section>

            {/* ⭐ 11. CANCELLATION OF A BOOKING (FULL 11.1 TO 11.5 + VISUAL TIMELINE) */}
            <section id="cancellation" className="scroll-mt-32 p-8 rounded-3xl bg-[#F6F7F6] border-2 border-neutral-900/10 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  Section 11 -  Cancellation Policy
                </span>
                <span className="text-xs font-mono text-neutral-400">Anchor: #cancellation</span>
              </div>

              <div>
                <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
                  11. Cancellation of a Booking
                </h2>
                <div className="mt-4 space-y-3 text-sm md:text-base leading-relaxed text-neutral-700">
                  <p><strong>11.1</strong> Cancellation by you of your booking must be given in writing and receipt must be confirmed by us. The effective date of cancellation is the date we receive your notification and the cancellation charges detailed in 11.3 will apply.</p>
                  <p><strong>11.2</strong> If you cancel, we will endeavour to obtain a replacement booking. If a replacement is obtained, we will refund all monies paid by you for the rental, less any difference between the total price you paid or would have paid for the rental and the price paid by the replacement guest and less our administration fee and original booking fee as set out in paragraph 11.3 below.</p>
                  <p><strong>11.3</strong> If you notify us in writing more than 6 weeks before the holiday start date that you wish to cancel, you will receive a full refund minus the booking confirmation fee and cancellation fee. If you notify us 6 weeks or less before the holiday start date the cancellation charge is 100% of the holiday price. Please note that all cancelled bookings will be subject to an administration fee of £75 in addition to the above charges.</p>
                  <p><strong>11.4</strong> Acceptance of the cancellation of part of a booking is at the sole discretion of the Owner and if accepted will be subject to the terms of this paragraph 11.</p>
                  <p><strong>11.5</strong> We recommend that cancellation insurance is taken out when making a booking. To include all eventualities including travel and road conditions, as owners are not liable for circumstances that may prevent property access.</p>
                </div>
              </div>

              {/* VISUAL TIMELINE SUMMARY */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-neutral-900">More than 6 Weeks</span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Full Refund *</span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Notice provided &gt; 6 weeks (42 days) prior to start date receives a full refund less booking confirmation fee and £75 admin charge.
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-neutral-900">6 Weeks or Less</span>
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">100% Charge</span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Notice provided ≤ 6 weeks prior to start date forfeits 100% of the price. Recovered sums refunded if a replacement booking is secured.
                  </p>
                </div>
              </div>
            </section>

            {/* 12. ALTERATIONS BY US */}
            <section id="section-12" className="term-card pt-6 border-t border-neutral-200/70">
              <span className="text-xs font-mono font-semibold text-neutral-400 uppercase tracking-widest">12</span>
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1 mb-4">12. Alterations by Us</h2>
              <div className="space-y-3 text-sm md:text-base leading-relaxed text-neutral-600">
                <p><strong>12.1</strong> In the interest of continual improvement we and the Owner reserve the right to make minor modifications to furniture, amenities, and facilities without any prior notice.</p>
              </div>
            </section>

            {/* 13. NON-AVAILABILITY OF THE PROPERTY */}
            <section id="section-13" className="term-card pt-6 border-t border-neutral-200/70">
              <span className="text-xs font-mono font-semibold text-neutral-400 uppercase tracking-widest">13</span>
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1 mb-4">13. Non-Availability of the Property</h2>
              <div className="space-y-3 text-sm md:text-base leading-relaxed text-neutral-600">
                <p><strong>13.1</strong> In the unlikely event that the Property is not available on the date booked (owing for instance to essential repairs, flood or fire damage or unforeseen termination of our agency agreement with the owner), if requested and if available we will try to arrange alternative accommodation of a similar type, price, standard and location. Alternatively, a refund of all monies paid by you to us will be made, or a proportion of the cost of the booking in the case of a curtailment.</p>
              </div>
            </section>

            {/* 14. DOGS (FULL 14.1 TO 14.4) */}
            <section id="section-14" className="term-card pt-6 border-t border-neutral-200/70">
              <span className="text-xs font-mono font-semibold text-neutral-400 uppercase tracking-widest">14</span>
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1 mb-4">14. Dogs</h2>
              <div className="space-y-3 text-sm md:text-base leading-relaxed text-neutral-600">
                <p><strong>14.1</strong> Well-behaved dogs are welcome subject to the conditions set out in paragraph 14.2.</p>
                <p><strong>14.2</strong> There are no specific modifications to the Property or facilities at the Property to accommodate dogs. Please refer to the section of the Property details entitled ‘Dogs’ for information on the number of dogs permitted at each Property, any associated charges and any additional restrictions that may apply. Assistance Dogs are welcome at all properties. In the event of you breaching the obligations of this paragraph 14.2, you may be charged a penalty fee or asked to vacate the Property and the booking will terminate immediately without any refund or compensation, but you will continue to be responsible for any costs stipulated in these Booking Terms and Conditions and we have the right to deduct such costs from the security deposit. You must not exceed the number of dogs allowed in the property unless by prior agreement, dogs must be included in the reservation at the time of booking or added by contacting us or the Owner before arrival, dogs must not be left alone or unattended in the property, dogs are not allowed in any bedrooms or on any furniture, any mess caused by the dog inside or outside the property must be removed and disposed of in a sanitary manner, including dog hair, dog poo etc., you are responsible for any damage caused by the dog to the property either externally or internally or if extra cleaning is required costs incurred by the Owner will be deducted from your security deposit.</p>
                <p><strong>14.3</strong> Neither we nor the Owner can be held responsible for the safety of your dog whilst staying at the property.</p>
                <p><strong>14.4</strong> Please note that where properties are not listed as dog-friendly, this does not guarantee that the Property has not been occupied by pets in the past.</p>
              </div>
            </section>

            {/* 15. ACCURACY */}
            <section id="section-15" className="term-card pt-6 border-t border-neutral-200/70">
              <span className="text-xs font-mono font-semibold text-neutral-400 uppercase tracking-widest">15</span>
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1 mb-4">15. Accuracy</h2>
              <div className="space-y-3 text-sm md:text-base leading-relaxed text-neutral-600">
                <p><strong>15.1</strong> Whilst we keep our illustrations, photographs, and other imagery as up to date as possible, any illustrations, photographs and other imagery displayed are for illustrative purposes only and subject to change.</p>
                <p><strong>15.2</strong> The contents of our web site and any online or offline marketing materials have been prepared in good faith. We will inform you of any significant changes at the time of booking or as soon as possible afterwards if you have already booked, but we shall not be liable for any minor or insignificant inaccuracy in descriptions and information.</p>
              </div>
            </section>

            {/* 16. PRIVACY POLICY LINK */}
            <section id="section-16" className="term-card pt-6 border-t border-neutral-200/70">
              <span className="text-xs font-mono font-semibold text-neutral-400 uppercase tracking-widest">16</span>
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1 mb-4">16. Privacy Policy</h2>
              <div className="space-y-3 text-sm md:text-base leading-relaxed text-neutral-600">
                <p><strong>16.1</strong> View our <Link to="/privacy-policy" className="text-neutral-950 font-semibold underline underline-offset-4">Privacy Policy</Link> to understand how your personal data is collected and processed in full compliance with UK Data Protection Regulations.</p>
              </div>
            </section>

            {/* 17. THE LAW */}
            <section id="section-17" className="term-card pt-6 border-t border-neutral-200/70">
              <span className="text-xs font-mono font-semibold text-neutral-400 uppercase tracking-widest">17</span>
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1 mb-4">17. The Law</h2>
              <div className="space-y-3 text-sm md:text-base leading-relaxed text-neutral-600">
                <p><strong>17.1</strong> These Booking Terms and Conditions and the booking contract to which they apply are governed in all respects by English Law and will be subject to the exclusive jurisdiction of the English Courts.</p>
              </div>
            </section>

            {/* 18. ENTIRE AGREEMENT AND SEVERANCE */}
            <section id="section-18" className="term-card pt-6 border-t border-neutral-200/70">
              <span className="text-xs font-mono font-semibold text-neutral-400 uppercase tracking-widest">18</span>
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1 mb-4">18. Entire Agreement and Severance</h2>
              <div className="space-y-3 text-sm md:text-base leading-relaxed text-neutral-600">
                <p><strong>18.1</strong> The booking contract incorporating these Booking Terms and Conditions constitutes the entire agreement between us and supersedes any previous agreements or conditions.</p>
                <p><strong>18.2</strong> If a court finds part of these Booking Terms and Conditions to be illegal, the rest will continue in force. Each of the paragraphs of these terms and conditions operate separately. If any court or relevant authority decides that any of them are unlawful, the remaining paragraphs will remain in full force and effect.</p>
              </div>
            </section>

            {/* 19. QUESTIONS OR COMPLAINTS */}
            <section id="section-19" className="term-card pt-6 border-t border-neutral-200/70">
              <span className="text-xs font-mono font-semibold text-neutral-400 uppercase tracking-widest">19</span>
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1 mb-4">19. Questions or Complaints</h2>
              <div className="space-y-3 text-sm md:text-base leading-relaxed text-neutral-600">
                <p><strong>19.1</strong> You can contact us by telephone on <a href="tel:+41795489771" className="font-semibold text-neutral-950 underline underline-offset-4">+41 79 548 9771</a> or email us at <a href="mailto:robert_smith@sky.com" className="font-semibold text-neutral-950 underline underline-offset-4">robert_smith@sky.com</a>.</p>
              </div>
            </section>

          </div>
        </div>

      </div>
    </main>
  );
}
