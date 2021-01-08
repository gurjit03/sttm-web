/* globals DOODLE_URL */

import React from 'react';
import PropTypes from 'prop-types';
import { SOURCES, SEARCH_TYPES, TYPES, SOURCES_WITH_ANG, MAX_ANGS } from '../constants';
import { Link } from 'react-router-dom';

import { EnhancedGurmukhiKeyboard } from './EnhancedGurmukhiKeyboard';
import SearchForm from './SearchForm';
import CrossIcon from './Icons/Times';
import Menu from './HeaderMenu';
import KeyboardIcon from './Icons/Keyboard';
import SearchIcon from './Icons/Search';
import Autocomplete from '@/components/Autocomplete';

import {
  toSearchURL,
  getQueryParams,
  getShabadList,
  reformatSearchTypes
} from '@/util';
export default class Header extends React.PureComponent {
  static defaultProps = { isHome: false, location: { search: '' } };

  static propTypes = {
    defaultQuery: PropTypes.string,
    isHome: PropTypes.bool,
    isController: PropTypes.bool,
    isAng: PropTypes.bool,
    location: PropTypes.shape({
      search: PropTypes.string,
    }),
    history: PropTypes.shape({ push: PropTypes.func }),
  };

  state = {
    showDoodle: false,
    doodleData: null,
  }

  fetchDoodle = () => {
    fetch(`${DOODLE_URL}`)
      .then(r => r.json())
      .then((data) => {
        if (data.error) {
          this.setState({ showDoodle: false, doodleData: null });
        } else if (data.rows.length) {
          this.setState({ showDoodle: true, doodleData: data.rows[0] });
        }
      }, (error) => {
        console.log(error);
        this.setState({ showDoodle: false, doodleData: null });
      }
      );
  }
  componentDidMount() {
    this.fetchDoodle();
  }

  onFormSubmit = ({ handleSubmit, ...data }) => e => {
    e.preventDefault();
    e.stopPropagation();
    handleSubmit();
    this.handleFormSubmit(data);
  };

  handleFormSubmit = data => {
    this.props.history.push(toSearchURL(data));
  }
  render() {
    const {
      props: { defaultQuery, isHome, isAng, isController },
      state: { showDoodle, doodleData },
      onFormSubmit,
      handleFormSubmit,
    } = this;

    const {
      source: defaultSource = null,
      type: defaultType = isAng ? SEARCH_TYPES.ANG.toString() : null,
    } = getQueryParams(location.search);

    const isSearchPageRoute = location.pathname.includes('search');
    const key = `${defaultQuery}${defaultSource}${defaultType}`;

    const controllerHeader = (
      <div className="top-bar no-select" id="controller-bar">
        <div className="top-bar-wrapper row controller-header">
          <div className="top-bar-title">
            <Link id="sync-logo" to="/" />
            <span className="logo-text"><span className="bolder">Bani</span> Controller</span>
          </div>
          <div className="responsive-menu">
            <Menu isHome={true} />
          </div>
        </div>
      </div>
    );

    if (isController) {
      return controllerHeader;
    }

    return (
      <div id="nav-bar" className={`top-bar no-select ${isHome ? 'top-bar-naked' : ''}`}>
        <div className="top-bar-wrapper row">
          {!isHome && (
            <div className="top-bar-title">
              {showDoodle ?
                (<>
                  <Link to="/" title={doodleData['Description']} className="doodle-link icon"
                    style={{ backgroundImage: `url(${doodleData['ImageSquare']}) ` }} />
                  <Link to="/" title={doodleData['Description']} className="doodle-link bigger-image"
                    style={{ backgroundImage: `url(${doodleData['Image']}) ` }} />
                </>) :
                (<Link to="/" />)
              }
            </div>
          )}
          <SearchForm
            key={key}
            defaultQuery={defaultQuery && decodeURIComponent(defaultQuery)}
            defaultSource={defaultSource}
            defaultType={Number(defaultType)}
            submitOnChangeOf={['type', 'source']}
            onSubmit={handleFormSubmit}
          >
            {({
              pattern,
              title,
              className,
              inputType,
              displayGurmukhiKeyboard,
              isShowKeyboard,
              query,
              type,
              source,
              action,
              name,
              placeholder,
              setGurmukhiKeyboardVisibilityAs,
              setQueryAs,
              handleKeyDown,
              handleSearchChange,
              handleSearchSourceChange,
              handleSearchTypeChange,
              handleSubmit,
            }) => {

              return (
                <React.Fragment>
                  <div id="responsive-menu">
                    <div className="top-bar-left">
                      {!isHome && (
                        <>
                          <form
                            action={action}
                            id="top-bar-search-form"
                            onSubmit={onFormSubmit({
                              handleSubmit,
                              type,
                              source,
                              query,
                            })}
                            className="search-form"
                          >
                            <ul className="menu">
                              <li>
                                <input
                                  name="type"
                                  className="hidden"
                                  defaultValue={type}
                                  id="search-type-value"
                                  hidden
                                />
                              </li>
                              <li>
                                <input
                                  name="source"
                                  defaultValue={source}
                                  className="hidden"
                                  id="search-source-value"
                                  hidden
                                />
                              </li>
                              <li>
                                <div id="search-container" className={displayGurmukhiKeyboard ? "kb-active" : ''}>
                                  <input
                                    type={inputType}
                                    id="search"
                                    autoComplete="off"
                                    autoCapitalize="none"
                                    autoCorrect="off"
                                    spellCheck={false}
                                    required="required"
                                    name={name}
                                    value={query}
                                    onKeyDown={handleKeyDown}
                                    onChange={handleSearchChange}
                                    className={className}
                                    placeholder={placeholder}
                                    title={title}
                                    pattern={pattern}
                                    min={name === 'ang' ? 1 : undefined}
                                    max={name === 'ang' ? MAX_ANGS[source] : undefined}
                                  />

                                  <button
                                    type="button"
                                    className="clear-search-toggle"
                                    onClick={setQueryAs('')}
                                  >
                                    <CrossIcon />
                                  </button>

                                  {isShowKeyboard && (
                                    <button
                                      type="button"
                                      className={`gurmukhi-keyboard-toggle ${displayGurmukhiKeyboard ? 'active' : ''
                                        }`}
                                      onClick={setGurmukhiKeyboardVisibilityAs(
                                        !displayGurmukhiKeyboard
                                      )}
                                    >
                                      <KeyboardIcon />
                                    </button>
                                  )}

                                  <button
                                    type="submit">
                                    <SearchIcon />
                                  </button>

                                  {isShowKeyboard && (
                                    <EnhancedGurmukhiKeyboard
                                      value={query}
                                      searchType={parseInt(type)}
                                      active={displayGurmukhiKeyboard}
                                      onKeyClick={newValue => setQueryAs(newValue)()}
                                      onClose={setGurmukhiKeyboardVisibilityAs(false)}
                                    />
                                  )}

                                  <Autocomplete
                                    isShowFullResults={(!isSearchPageRoute) || (isSearchPageRoute && decodeURI(defaultQuery) !== query)}
                                    getSuggestions={getShabadList}
                                    searchOptions={{ type: parseInt(type), source }}
                                    value={query}
                                  />
                                </div>
                              </li>
                            </ul>
                          </form>
                          <div id="search-options">
                            <select
                              name="type"
                              id="search-type"
                              value={type.toString()}
                              onChange={handleSearchTypeChange}
                            >
                              {reformatSearchTypes(TYPES).map(({ type, value }) => (
                                <option key={value} value={value}>
                                  {type}
                                </option>
                              ))}
                            </select>
                            {parseInt(type) === SEARCH_TYPES['ANG'] ? (
                              <select
                                name="source"
                                value={Object.keys(SOURCES_WITH_ANG).includes(source) ? source : 'G'}
                                onChange={handleSearchSourceChange}
                              >
                                {Object.entries(SOURCES_WITH_ANG).map(([value, children]) => (
                                  <option key={value} value={value}>
                                    {children}
                                  </option>
                                ))}
                              </select>
                            ) : (
                                <select
                                  name="source"
                                  value={source}
                                  onChange={handleSearchSourceChange}
                                >
                                  {Object.entries(SOURCES).map(([value, children]) => (
                                    <option key={value} value={value}>
                                      {children}
                                    </option>
                                  ))}
                                </select>)}
                          </div>
                        </>
                      )}
                    </div>
                    <Menu
                      isHome={isHome}
                    />
                  </div>
                </React.Fragment>
              )
            }}
          </SearchForm>
        </div>
      </div>
    );
  }
}
