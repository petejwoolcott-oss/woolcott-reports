// fill-abbotsbury-v5.js — corrected per Justine's Aug 21 feedback
// 2259 Abbottsbury Street, Burlington | Drew Woolcott | Coordinator: Justine Woolcott
// Source: GeoWarehouse, MPAC, Tax doc, Subject search XA713893
//
// v5 corrections (Aug 21):
// - Page 11 (ITSO room grid): added bathrooms (rooms 9-11)
// - Page 20 room counts: Text1081-1086 are rooms/beds/kitchens AG+BG (NOT washroom fields)
//   Fixed values: rooms 7+1, beds 3+0, kitchens 1+0
// - Page 20 washroom grid: actual fields are Text1096-1099 (were blank in v4)
//   Row 1: 2 four-piece, second floor (Check Box1350)
//   Row 2: 1 two-piece, main floor (Check Box1354)
// - Page 20 washroom level: removed wrong checkboxes 1348 (lower/wrong) and 1356 (third level)
// - Page 21 (PropTx room grid): added bathrooms (rooms 9-11)
// - Page 26 address: Text162 = "2259 Abbotsbury Street, Burlington ON L7P 4H7"

const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

async function main() {
  const bytes = fs.readFileSync('listing-paperwork/blank-forms/One_Fill_Listing_Package_Blank.pdf');
  const pdf = await PDFDocument.load(bytes);
  const form = pdf.getForm();
  const warn = [];

  function txt(name, value) {
    try { form.getTextField(name).setText(value ?? ''); }
    catch { warn.push('TextField missing: ' + name); }
  }

  function chk(name, on = true) {
    try { const f = form.getCheckBox(name); on ? f.check() : f.uncheck(); }
    catch { warn.push('CheckBox missing: ' + name); }
  }

  function radio(name, value) {
    try {
      const f = form.getRadioGroup(name);
      const opts = f.getOptions();
      if (opts.includes(value)) f.select(value);
      else warn.push(`Radio "${name}" → no option "${value}". Has: ${opts.join(' | ')}`);
    } catch { warn.push('RadioGroup missing: ' + name); }
  }

  // ── PAGE 1: File Info ───────────────────────────────────────────────────────
  txt('Client Name 1', 'Anna Morrison');
  // All other Page 1 fields LEFT BLANK per Justine rules

  // ── PAGE 3: BrokerBay ──────────────────────────────────────────────────────
  txt('street #', '2259');
  txt('street', 'Abbottsbury');
  txt('street type', 'Street');
  txt('city', 'Burlington');
  txt('L-agent', 'Drew Woolcott');
  txt('OFFICE', 'RE/MAX Escarpment Realty Inc.');
  // All appointment/access/showing/seller-info fields LEFT BLANK

  // ── PAGE 6: ITSO — Transaction / Property Type ──────────────────────────────
  chk('chkOpt_Trans', true);        // SALE
  chk('chkOpt_REComponent', true);  // REAL ESTATE (Moveable = No)

  // ── PAGE 6: ITSO — Location ─────────────────────────────────────────────────
  txt('txtp_streetnum', '2259');
  txt('txtp_street', 'Abbottsbury');
  txt('txtp_unitNumber', '');
  txt('txtp_city', 'Burlington');
  txt('txtp_zipcode', 'L7P 4H7');
  txt('txtProvince', 'ON');
  txt('postal', 'L7P 4H7');
  txt('roll #', '240204040187910');
  txt('PIN #', '071610070');
  txt('Region', 'Halton');
  txt('Municipality/Sub-Area', '34 – Burlington');
  txt('neighbourhood', '341 – Brant Hills');
  txt('legal description 1', 'PCL 142-1, SEC M178; LT 142, PL M178; S/T H128315');
  txt('legal description 2', 'BURLINGTON/NELSON TWP');
  txt('cross street', 'Kirkburn Cr.');
  txt('Directions', 'Kirkburn Cr.');
  txt('Zoning', 'R3.2');
  txt('frontage', '50.0');
  txt('depth', '107.31');

  chk('front north', true);   // FIXED: North (was South)
  chk('Check Box96', true);   // Lot size = Feet

  // Lot
  chk('lot shape - rectangular', true);
  chk('lot source - geo', true);
  chk('acreage - under 0.5', true);
  txt('lot size', '0.133');
  chk('unit - acres', true);

  // Location = Urban
  chk('chkOpt_Location', true);

  // Property access: Municipal Road only
  chk('chkOpt_Access4', true);

  // Waterfront
  chk('waterfront - no', true);

  // Special designation = Unknown
  chk('special designation - unknown', true);

  // ── PAGE 6: ITSO — Amounts / Dates ──────────────────────────────────────────
  txt('taxes', '5,736');
  txt('tax year', '2026');
  txt('assessment #', '565,000');
  txt('assessment yr', '2016');
  txt('holdover', '90');
  txt('deposit', '5%');
  chk('HST - no', true);
  chk('special agreement - yes', true);
  chk('environmental audit - no', true);
  chk('current financing - clear', true);
  chk('local improvements - no', true);
  // Survey type: LEFT BLANK

  // ── PAGE 7: ITSO — Agent / Brokerage ────────────────────────────────────────
  txt('txtl_brkagent', 'Drew Woolcott');
  txt('txtl_brkagentemail', 'Drewandjayne@woolcott.ca');
  txt('txtl_brkagentph', '905-689-9223');
  txt('txtl_broker', 'RE/MAX Escarpment Realty Inc.');
  txt('brokerage',   'RE/MAX Escarpment Realty Inc.');

  txt('SB commission', "2% {1% + HST REDUCTION TO COOPERATING BROKER COMMISSION IF BUYER (OR BUYER'S FAMILY) IS SHOWN BY WOOLCOTT TEAM MEMBER AND THEN BRINGS SUCCESSFUL OFFER (OPEN HOUSES EXCLUDED)}");

  chk('representation - designated', true);
  chk('contact sellers - no', true);
  chk('interest bearing - yes', true);
  chk('holding offers - no', true);

  // ── PAGE 7: ITSO — Showing / Offer remarks ──────────────────────────────────
  txt('offer remarks', 'Please page Drew Woolcott RE: offers & inquiries (Drewandjayne@woolcott.ca). Attach Schedule B & form 801.');
  txt('Showing Instructions', 'Please use BrokerBay or call the Appointment Centre (905 297 7777).');
  chk('occupant - owner', true);

  // ── PAGE 7: ITSO — Year Built / Age ─────────────────────────────────────────
  txt('yr built', '1980');
  chk('age - 31-50 yrs', true);
  chk('YB source - other', true);

  // ── PAGE 9: ITSO — Exterior ──────────────────────────────────────────────────
  chk('construction materials - solid brick', true);
  chk('construction materials - other', true);
  chk('sewers - sewer (municipal)', true);
  chk('water source - municipal', true);
  chk('other structures - fence - full', true);
  chk('exterior feats - patios', true);

  chk('garage - yes', true);
  chk('garage type - attached', true);
  txt('garage spaces', '2');
  txt('driveway spaces', '2');
  txt('total parking spaces', '4');
  chk('parking features - inside entry', true);

  // ── PAGE 10: ITSO — Interior ─────────────────────────────────────────────────
  chk('cooling - central air', true);
  chk('heating - forced air', true);
  chk('heating - gas', true);
  chk('interior features - air exchanger', true);
  chk('laundry - main level', true);
  chk('under contract - hot water heater', true);
  chk('UFFI - no', true);

  chk('operational fireplace stove - yes', true);
  chk('fireplace - natural gas', true);
  chk('fireplace - family room', true);
  txt('# of fireplaces', '1');

  chk('appx sqft - 1500-2000', true);
  txt('AG sqft', '1832');
  chk('chkOpt_AboveGrade', true);
  chk('AG - MPAC', true);

  txt('ITSO add inclusions', 'Dishwasher');
  txt('exclusions 1', 'Dining Room Chandelier');

  // ── PAGE 11: ITSO Room Grid ──────────────────────────────────────────────────
  // Main floor first, then second floor, then basement.
  // Bathrooms NOW INCLUDED (per Justine Aug 21 correction — previously excluded in error).

  // Room 1: Family Room — Main — 18'4" x 11'0"
  txt('hidRoom1Lvl', 'Main');
  txt('hidRoom1Type', 'Family Room');
  txt('txtRoom1Length1', '18'); txt('txtRoom1Length2', '4');
  txt('txtRoom1Width1', '11');  txt('txtRoom1Width2', '0');

  // Room 2: Living Room — Main — 16'9" x 10'9"
  txt('hidRoom2Lvl', 'Main');
  txt('hidRoom2Type', 'Living Room');
  txt('txtRoom2Length1', '16'); txt('txtRoom2Length2', '9');
  txt('txtRoom2Width1', '10');  txt('txtRoom2Width2', '9');

  // Room 3: Dining Room — Main — 10'4" x 10'0"
  txt('hidRoom3Lvl', 'Main');
  txt('hidRoom3Type', 'Dining Room');
  txt('txtRoom3Length1', '10'); txt('txtRoom3Length2', '4');
  txt('txtRoom3Width1', '10');  txt('txtRoom3Width2', '0');

  // Room 4: Kitchen — Main — 10'9" x 13'0"
  txt('hidRoom4Lvl', 'Main');
  txt('hidRoom4Type', 'Kitchen');
  txt('txtRoom4Length1', '10'); txt('txtRoom4Length2', '9');
  txt('txtRoom4Width1', '13');  txt('txtRoom4Width2', '0');
  txt('txtRoom4Desc', 'Eat In Kitchen');

  // Room 5: Primary Bedroom — Second — 15'5" x 15'5"
  txt('hidRoom5Lvl', 'Second');
  txt('hidRoom5Type', 'Primary Bedroom');
  txt('txtRoom5Length1', '15'); txt('txtRoom5Length2', '5');
  txt('txtRoom5Width1', '15');  txt('txtRoom5Width2', '5');

  // Room 6: Bedroom — Second — 11'2" x 11'4"
  txt('hidRoom6Lvl', 'Second');
  txt('hidRoom6Type', 'Bedroom');
  txt('txtRoom6Length1', '11'); txt('txtRoom6Length2', '2');
  txt('txtRoom6Width1', '11');  txt('txtRoom6Width2', '4');

  // Room 7: Bedroom — Second — 11'5" x 11'2"
  txt('hidRoom7Lvl', 'Second');
  txt('hidRoom7Type', 'Bedroom');
  txt('txtRoom7Length1', '11'); txt('txtRoom7Length2', '5');
  txt('txtRoom7Width1', '11');  txt('txtRoom7Width2', '2');

  // Room 8: Bonus Room — Basement — no dimensions
  txt('hidRoom8Lvl', 'Basement');
  txt('hidRoom8Type', 'Bonus Room');

  // Room 9: Powder Room — Main (2-piece washroom)
  txt('hidRoom9Lvl', 'Main');
  txt('hidRoom9Type', 'Powder Room');
  chk('chkOpt_Bath9', true);

  // Room 10: Bathroom — Second (4-piece)
  txt('hidRoom10Lvl', 'Second');
  txt('hidRoom10Type', 'Bathroom');
  chk('chkOpt_Bath10', true);

  // Room 11: Bathroom — Second (4-piece)
  txt('hidRoom11Lvl', 'Second');
  txt('hidRoom11Type', 'Bathroom');
  chk('chkOpt_Bath11', true);

  // ── PAGE 20: Room/Building Counts ────────────────────────────────────────────
  // Building 1 summary (total counts per building — separate from AG/BG split below)
  txt('txtBuilding1Beds', '3');       // 3 bedrooms total
  txt('txtBuilding1Kitchens', '1');   // 1 kitchen
  txt('txtBuilding1Baths', '3');      // 2 four-piece + 1 two-piece = 3 total

  // Number of Rooms — above + below grade (Text1081/1082)
  // CORRECTED: these are the room COUNT fields, not washroom fields (v4 had wrong values)
  txt('Text1081', '7');   // 7 rooms above grade (Fam + Living + Dining + Kitchen + 3 Beds)
  txt('Text1082', '1');   // 1 room below grade (Bonus Room)

  // Number of Bedrooms — above + below grade (Text1083/1084)
  txt('Text1083', '3');   // 3 bedrooms above grade
  txt('Text1084', '0');   // 0 bedrooms below grade

  // Number of Kitchens — above + below grade (Text1085/1086)
  txt('Text1085', '1');   // 1 kitchen above grade (main floor)
  txt('Text1086', '0');   // 0 kitchens below grade

  // ── PAGE 20: Washroom Detail Grid ───────────────────────────────────────────
  // CORRECTED: actual washroom count/pieces fields are Text1096-1099 (NOT 1081-1084)
  // Row 1: 2 four-piece washrooms — second floor
  txt('Text1096', '2');   // # washrooms in this row
  txt('Text1097', '4');   // # pieces (4-piece)

  // Row 2: 1 two-piece washroom — main floor
  txt('Text1098', '1');   // # washrooms in this row
  txt('Text1099', '2');   // # pieces (2-piece)

  // ── PAGE 20: Washroom Level Checkboxes ──────────────────────────────────────
  // Pattern (5 options per row): Lower=+0, Main=+1, Second=+2, Third=+3, Other=+4
  // Row 1 base = 1348, Row 2 base = 1353
  //
  // REMOVED (v4 mistakes):
  //   Check Box1348 = Lower, Row 1 — was incorrectly checked
  //   Check Box1356 = Third,  Row 2 — was incorrectly checked (the "third level" Justine flagged)
  //
  // ADDED (v5 corrections):
  //   Check Box1350 = Second floor, Row 1 — for the 2 four-piece washrooms
  //   Check Box1354 = Main floor,   Row 2 — for the 1 two-piece washroom (per Justine "select main")

  chk('Check Box1350', true);   // Row 1: Second floor (4-piece bathrooms)
  chk('Check Box1354', true);   // Row 2: Main floor (2-piece / powder room)

  // Family Room / Bonus Room = YES
  chk('Check Box875', true);

  // ── PAGE 21: PropTx Room Grid ─────────────────────────────────────────────
  // Same floor order: Main first, Second, Basement.
  // Bathrooms also added here to match ITSO grid.

  txt('rm1lvl', 'Main');
  txt('TREBroom1', 'Family Room');
  txt('TREBlengthrm1', "18'4\"");
  txt('TREBwidthrm1', "11'0\"");

  txt('rm2lvl', 'Main');
  txt('TREBroom2', 'Living Room');
  txt('TREBlengthrm2', "16'9\"");
  txt('TREBwidthrm2', "10'9\"");

  txt('rm3lvl', 'Main');
  txt('TREBroom3', 'Dining Room');
  txt('TREBlengthrm3', "10'4\"");
  txt('TREBwidthrm3', "10'0\"");

  txt('rm4lvl', 'Main');
  txt('TREBroom4', 'Kitchen');
  txt('TREBlengthrm4', "10'9\"");
  txt('TREBwidthrm4', "13'0\"");
  txt('rm4desc1', 'Eat In Kitchen');

  txt('rm5lvl', 'Second');
  txt('TREBroom5', 'Primary Bedroom');
  txt('TREBlengthrm5', "15'5\"");
  txt('TREBwidthrm5', "15'5\"");

  txt('rm6lvl', 'Second');
  txt('TREBroom6', 'Bedroom');
  txt('TREBlengthrm6', "11'2\"");
  txt('TREBwidthrm6', "11'4\"");

  txt('rm7lvl', 'Second');
  txt('TREBroom7', 'Bedroom');
  txt('TREBlengthrm7', "11'5\"");
  txt('TREBwidthrm7', "11'2\"");

  txt('rm8lvl', 'Basement');
  txt('TREBroom8', 'Bonus Room');

  // Bathrooms added (per Justine Aug 21)
  txt('rm9lvl', 'Main');
  txt('TREBroom9', 'Powder Room');

  txt('rm10lvl', 'Second');
  txt('TREBroom10', 'Bathroom');

  txt('rm11lvl', 'Second');
  txt('TREBroom11', 'Bathroom');

  // ── PropTx ─────────────────────────────────────────────────────────────────
  chk('type - detached', true);
  chk('storeys - 2', true);
  chk('link - no', true);
  chk('POTL - no', true);
  chk('assignment - no', true);
  chk('fractional ownership - no', true);
  chk('vacant land condo - no', true);
  chk('lot shape - rectangular', true);
  chk('lot source - geo', true);
  chk('acreage - under 0.5', true);
  chk('waterfront - no', true);
  chk('front north', true);
  chk('garage - yes', true);
  chk('garage type - attached', true);
  chk('water source - municipal', true);
  chk('sewers - sewer (municipal)', true);
  chk('age - 31-50 yrs', true);
  chk('appx sqft - 1500-2000', true);
  chk('physically handicapped equipped - no', true);
  chk('local improvements - no', true);
  chk('HST - no', true);
  chk('access - year round municipal road', true);

  txt('TREBinclusions1', 'Dishwasher');
  txt('Text69', 'Dining Room Chandelier');   // exclusions field

  // PropTx address (pages 38/40) — full address with comma
  txt('txtpropAddrLine2', '2259 Abbotsbury Street, Burlington ON L7P 4H7');

  // ── PAGE 26: Property Address Section ───────────────────────────────────────
  // Text162 = the combined property address field on page 26
  // CORRECTED: Justine saw "2259 Abbotsbury St Burlington" — updating to full correct address
  txt('Text162', '2259 Abbotsbury Street, Burlington ON L7P 4H7');

  // ── Save ─────────────────────────────────────────────────────────────────────
  const out = await pdf.save();
  fs.writeFileSync('listing-paperwork/2259-Abbotsbury-OneFill-v5.pdf', out);

  if (warn.length) {
    console.log('\n⚠️  Warnings (' + warn.length + '):');
    warn.forEach(w => console.log('  -', w));
  } else {
    console.log('\n✅ All fields matched — no warnings');
  }
  console.log('\n✅ Saved: listing-paperwork/2259-Abbotsbury-OneFill-v5.pdf');
}

main().catch(e => { console.error(e); process.exit(1); });
