import React from "react";

import Jumbotron from "./components/jumbotron";

export default class HomePreview extends React.Component {
  componentDidMount() {
    // Load iconify script for icon previews
    if (!document.querySelector('script[src*="iconify"]')) {
      const script = document.createElement('script');
      script.src = 'https://code.iconify.design/iconify-icon/2.1.0/iconify-icon.min.js';
      document.head.appendChild(script);
    }
  }

  render() {
    const {entry, getAsset} = this.props;
    const image = getAsset(entry.getIn(["data", "image"]));
    const blurbImage = getAsset(entry.getIn(["data", "blurb", "image"]));

    return <div>
      <Jumbotron image={image} title={entry.getIn(["data", "title"])} subtitle={entry.getIn(["data", "subtitle"])} kerned={true}/>

      <div className="bg-light-blue pv4">
        <div className="ph3 mw7 center">
          <div className="flex-l mhn2-l items-center">
            <div className="w-50-l ph2-l">
              <h2 className="f2 b lh-title mb2">{entry.getIn(["data", "blurb", "heading"])}</h2>
              <p className="mb0">{entry.getIn(["data", "blurb", "text"])}</p>
            </div>
            {blurbImage && <div className="w-50-l ph2-l">
              <img src={blurbImage} alt="" className="mb3"/>
            </div>}
          </div>
        </div>
      </div>

      <section className="info-section">
        <div className="cards-grid mw8 center ph3">
          {(entry.getIn(["data", "info_cards", "cards"]) || []).map((card, i) => (
            <div className="info-card" key={i}>
              <div className="card-icon">
                <iconify-icon icon={card.get("icon")}></iconify-icon>
              </div>
              <h3>{card.get("heading")}</h3>
              <p dangerouslySetInnerHTML={{__html: card.get("text")}}></p>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-off-white pv4">
        <div className="ph3 mw7 center">
          <h2 className="f2 b lh-title mb2">{entry.getIn(["data", "intro", "heading"])}</h2>
          <p className="mb4 mw6">{entry.getIn(["data", "intro", "text"])}</p>

          <div className="flex-ns mhn2-ns mb3">
            {(entry.getIn(["data", "products"]) || []).map((product, i) => <div className="ph2-ns w-50-ns" key={i}>
              <img src={getAsset(product.get("image"))} alt={product.get("imageAlt") || ""} className="center db mb3" style={{width: "240px"}}/>
              <p>{product.get("text")}</p>
            </div>)}
          </div>

          <div className="tc">
            <a href="#" className="btn raise">See all products</a>
          </div>
        </div>
      </div>

      <div className="bg-light-blue pv4">
        <div className="ph3 mw7 center">

          <div className="flex-l mhn2-l">
            <div className="w-40-l ph2-l">
              <h2 className="f2 b lh-title mb2">{entry.getIn(["data", "values", "heading"])}</h2>

              <p>{entry.getIn(["data", "values", "text"])}</p>
            </div>

            <div className="w-60-l ph2-l">
              <img src={getAsset(entry.getIn(["data", "values", "image"]))} alt={entry.getIn(["data", "values", "imageAlt"]) || ""} className="mb3"/>
            </div>
          </div>

          <div className="tc">
            <a href="/values" className="btn raise">Read more</a>
          </div>

        </div>
      </div>

      <div className="bg-light-pink pv4">
        <div className="ph3 mw7 center">

          <div className="flex-l mhn2-l">
            <div className="w-60-l ph2-l">
              <img src={getAsset(entry.getIn(["data", "story", "image"]))} alt={entry.getIn(["data", "story", "imageAlt"]) || ""} className="mb3"/>
            </div>

            <div className="w-40-l ph2-l">
              <h2 className="f2 b lh-title mb2">{entry.getIn(["data", "story", "heading"])}</h2>

              <p>{entry.getIn(["data", "story", "text"])}</p>
            </div>
          </div>

        </div>
      </div>


    </div>;
  }
}
