type Props = {
  title: string;
  value: string | number;
};

export const StatCard = ({ title, value }: Props) => {
  return (
    <div className="card">
      <div className="card__border"></div>
      <div className="card_title__container">
        <span className="card_title">{title}</span>
        {/*<p className="card_paragraph">*/}
        {/*  Perfect for your next content, leave to us and enjoy the result!*/}
        {/*</p>*/}
      </div>
      <h3 className="text-3xl font-semibold mt-2">
        {value}
      </h3>
    </div>
  );
};
