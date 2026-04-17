"use client";

import { Printer } from "lucide-react";
import { formatCurrency, formatCurrencyPrecise } from "@/lib/estimator/calculate";
import type { EstimateInput, EstimateResult } from "@/lib/types/estimator";
import { STATE_REGISTRY } from "@/content/state-registry";

interface Props {
  input: EstimateInput;
  result: EstimateResult;
  companyName?: string;
}

export function EstimatePdf({
  input,
  result,
  companyName = "IronForge Estimator",
}: Props) {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const stateData = input.state ? STATE_REGISTRY[input.state] : undefined;

  function handlePrint() {
    window.print();
  }

  return (
    <>
      <button
        type="button"
        onClick={handlePrint}
        className="no-print inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-mono font-semibold text-xs tracking-wider uppercase btn-neon-cyan"
      >
        <Printer className="w-4 h-4" />
        Download / Print PDF
      </button>

      {/* Hidden printable view — only visible when printing. */}
      <div className="print-only estimate-printable hidden">
        <header className="pdf-header">
          <div>
            <h1 className="pdf-company">{companyName}</h1>
            <div className="pdf-sub">Steel Erection — Bid Estimate</div>
          </div>
          <div className="pdf-date">
            <div>
              <strong>Date:</strong> {today}
            </div>
            <div>
              <strong>Estimate #:</strong> EST-
              {Date.now().toString().slice(-6)}
            </div>
          </div>
        </header>

        <section className="pdf-section">
          <h2>Project Information</h2>
          <table className="pdf-info-table">
            <tbody>
              <tr>
                <th>Project</th>
                <td>{input.projectName || "Untitled Project"}</td>
                <th>Type</th>
                <td>{input.projectType}</td>
              </tr>
              <tr>
                <th>State</th>
                <td>{stateData ? stateData.name : input.state || "—"}</td>
                <th>Workforce</th>
                <td>{input.isUnion ? "Union" : "Non-Union"}</td>
              </tr>
              <tr>
                <th>Tonnage</th>
                <td>{input.tonnage.toLocaleString()} tons</td>
                <th>Duration</th>
                <td>{input.durationWeeks} weeks</td>
              </tr>
              <tr>
                <th>Floors</th>
                <td>{input.floors}</td>
                <th>Crew Size</th>
                <td>{input.crewSize}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="pdf-section">
          <h2>Cost Breakdown</h2>
          <table className="pdf-cost-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Line Item</th>
                <th className="right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="cat">
                <td rowSpan={5}>Labor</td>
                <td>Journeyman wages</td>
                <td className="right">
                  {formatCurrency(result.labor.journeymanCost)}
                </td>
              </tr>
              <tr>
                <td>Foreman wages</td>
                <td className="right">
                  {formatCurrency(result.labor.foremanCost)}
                </td>
              </tr>
              <tr>
                <td>Burden (taxes, WC, benefits)</td>
                <td className="right">
                  {formatCurrency(result.labor.burdenRate)}
                </td>
              </tr>
              <tr>
                <td>Straight-time hours</td>
                <td className="right">
                  {result.labor.straightTimeHours.toFixed(0)} hrs
                </td>
              </tr>
              <tr className="subtotal">
                <td>Labor Subtotal</td>
                <td className="right">
                  {formatCurrency(result.labor.totalLabor)}
                </td>
              </tr>

              <tr className="cat">
                <td rowSpan={5}>Materials</td>
                <td>Bolts & connections</td>
                <td className="right">
                  {formatCurrency(result.materials.boltsConnections)}
                </td>
              </tr>
              <tr>
                <td>Welding consumables</td>
                <td className="right">
                  {formatCurrency(result.materials.weldingConsumables)}
                </td>
              </tr>
              <tr>
                <td>Decking material</td>
                <td className="right">
                  {formatCurrency(result.materials.deckingMaterial)}
                </td>
              </tr>
              <tr>
                <td>Miscellaneous</td>
                <td className="right">
                  {formatCurrency(result.materials.miscMaterials)}
                </td>
              </tr>
              <tr className="subtotal">
                <td>Materials Subtotal</td>
                <td className="right">
                  {formatCurrency(result.materials.totalMaterials)}
                </td>
              </tr>

              <tr className="cat">
                <td rowSpan={5}>Equipment</td>
                <td>Crane rental</td>
                <td className="right">
                  {formatCurrency(result.equipment.craneCost)}
                </td>
              </tr>
              <tr>
                <td>Man-lift</td>
                <td className="right">
                  {formatCurrency(result.equipment.liftCost)}
                </td>
              </tr>
              <tr>
                <td>Welding equipment</td>
                <td className="right">
                  {formatCurrency(result.equipment.weldingEquipCost)}
                </td>
              </tr>
              <tr>
                <td>Small tools allowance</td>
                <td className="right">
                  {formatCurrency(result.equipment.smallToolsAllowance)}
                </td>
              </tr>
              <tr className="subtotal">
                <td>Equipment Subtotal</td>
                <td className="right">
                  {formatCurrency(result.equipment.totalEquipment)}
                </td>
              </tr>

              <tr className="cat">
                <td rowSpan={4}>Overhead</td>
                <td>General conditions (8%)</td>
                <td className="right">
                  {formatCurrency(result.overhead.generalConditions)}
                </td>
              </tr>
              <tr>
                <td>Insurance (GL + WC)</td>
                <td className="right">
                  {formatCurrency(result.overhead.insurance)}
                </td>
              </tr>
              <tr>
                <td>Bonding (~2.5%)</td>
                <td className="right">
                  {formatCurrency(result.overhead.bonding)}
                </td>
              </tr>
              <tr className="subtotal">
                <td>Overhead Subtotal</td>
                <td className="right">
                  {formatCurrency(result.overhead.totalOverhead)}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="pdf-section">
          <h2>Bid Summary</h2>
          <table className="pdf-summary-table">
            <tbody>
              <tr>
                <th>Direct Costs</th>
                <td className="right">
                  {formatCurrency(result.summary.directCosts)}
                </td>
              </tr>
              <tr>
                <th>Total Overhead</th>
                <td className="right">
                  {formatCurrency(result.summary.totalOverhead)}
                </td>
              </tr>
              <tr className="subtotal">
                <th>Subtotal</th>
                <td className="right">
                  {formatCurrency(result.summary.subtotal)}
                </td>
              </tr>
              <tr>
                <th>Profit (10%)</th>
                <td className="right">
                  {formatCurrency(result.summary.profit)}
                </td>
              </tr>
              <tr>
                <th>Contingency (5%)</th>
                <td className="right">
                  {formatCurrency(result.summary.contingency)}
                </td>
              </tr>
              <tr className="total">
                <th>TOTAL BID</th>
                <td className="right">
                  {formatCurrency(result.summary.totalBid)}
                </td>
              </tr>
              <tr>
                <th>Cost per Ton</th>
                <td className="right">
                  {result.summary.costPerTon > 0
                    ? formatCurrency(result.summary.costPerTon)
                    : "—"}
                </td>
              </tr>
              <tr>
                <th>Cost per Sqft</th>
                <td className="right">
                  {result.summary.costPerSqft > 0
                    ? formatCurrencyPrecise(result.summary.costPerSqft)
                    : "—"}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <footer className="pdf-footer">
          <p>
            <strong>Disclaimer:</strong> This is a preliminary ballpark
            estimate generated by IronForge. Actual bid pricing should be
            verified with current wage rates, local material pricing, and
            site-specific conditions.
          </p>
          <p>Generated by IronForge — ironforge.dev</p>
        </footer>
      </div>
    </>
  );
}
