import { ACT67, type Act67Content } from '@/scenes/06-firma/content';

export function InvestorRange({ range }: { range: Act67Content['investorRange'] }) {
  return (
    <section data-investor-range>
      <h3>{ACT67.copy.rangeHeading}</h3>
      <p>{range.fromDetail}</p>
      <div className="investor-range">
        <span>{range.from}</span>
        <div aria-hidden="true" className="investor-range__bar" />
        <span>{range.to}</span>
      </div>
      <p>{range.toDetail}</p>
    </section>
  );
}
