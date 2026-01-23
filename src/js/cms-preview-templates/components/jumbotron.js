import React from "react";

export default class Jumbotron extends React.Component {
  render() {
    const {image, title, subtitle, kerned} = this.props;

    const renderTitle = () => {
      if (kerned && title) {
        const words = title.split(' ');
        let globalIndex = 0;
        return (
          <span aria-hidden="true">
            {words.map((word, wordIndex) => {
              const spaceIndex = globalIndex;
              if (wordIndex > 0) {
                globalIndex += 1; // account for space
              }
              const wordStartIndex = globalIndex;
              const letters = word.split('').map((char, i) => (
                <span key={wordStartIndex + i} className={`letter letter-${wordStartIndex + i}`} data-char={char}>{char}</span>
              ));
              globalIndex += word.length;
              return (
                <React.Fragment key={wordIndex}>
                  {wordIndex > 0 && <span className={`letter letter-${spaceIndex}`} data-char=" "> </span>}
                  <span className="word">{letters}</span>
                </React.Fragment>
              );
            })}
          </span>
        );
      }
      return title;
    };

    return <div>
      <div className="pv5 pv6-l ph3 bg-center cover" style={{
        backgroundImage: image && `url(${image})`
      }}>
        <div className="mw7 center ph3">
          <div className="db mb3">
            <div className="mw7 relative bg-fix-primary mb3">
              <h1
                className={`f2 f1-l b di lh-title mb3 white mw6 bg-primary${kerned ? ' kerned-title' : ''}`}
                data-text={title}
                {...(kerned ? {'aria-label': title} : {})}
              >
                { renderTitle() }
              </h1>
            </div>
            <div className="mw7 relative bg-fix-primary">
              {subtitle && <p className="b f4 di lh-title mb3 white mw6 bg-primary">{ subtitle }</p>}
            </div>
          </div>
        </div>
      </div>
    </div>;
  }
}
