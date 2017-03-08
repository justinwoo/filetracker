// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "phoenix_html"

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

// import socket from "./socket"

import {Observable} from 'rxjs';
import run from '@cycle/rxjs-run'
import {makeDOMDriver, div, h1, button, a} from '@cycle/dom';
import {makeHTTPDriver} from '@cycle/http';

function main(sources) {
  const files$ = sources.http.select('files')
    .flatMap(x => x)
    .map(x => x.body)
  const data$ = sources.http.select('data')
    .flatMap(x => x)
    .map(x => x.body)
  const dom = Observable.combineLatest(
    files$,
    data$,
    (files, data) =>
      div('', {
        style: {
          margin: '0 auto',
          width: '800px'
        }
      }, [
        h1('', {}, 'Filetracker'),
        div('.files', {}, files.map(file => {
          const watched = data[file];
          return div('.file', {
            style: {
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              margin: '5px'
            }
          }, [
            a('.file-link', {
              style: {
                flex: 1
              },
              dataset: {
                file
              }
            }, file),
            button('.file-button', {
              style: {
                width: '100px'
              },
              dataset: {
                file,
                watched
              }
            }, watched ? 'watched' : 'not watched')
          ])
        }))
      ])
  );
  const http = Observable.merge(
    Observable.from([{
      url: '/api/files',
      category: 'files'
    }, {
      url: '/api/data',
      category: 'data'
    }]),
    sources.dom.select('.file-button').events('click')
      .map(e => ({
        file: e.target.dataset.file,
        watched: !e.target.dataset.watched
      }))
      .map(send => ({
        url: '/api/update',
        method: 'POST',
        send,
        category: 'data'
      })),
    sources.dom.select('.file-link').events('click')
      .map(e => ({
        file: e.target.dataset.file
      }))
      .map(send => ({
        url: '/api/open',
        method: 'POST',
        send
      }))
  );
  return {
    dom,
    http
  };
}

const drivers = {
  dom: makeDOMDriver('#app'),
  http: makeHTTPDriver()
}

run(main, drivers);