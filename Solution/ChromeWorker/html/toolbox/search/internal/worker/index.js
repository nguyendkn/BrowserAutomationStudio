SearchLib.Worker = {
  create: function ({ onmessage, onerror }) {
    const worker = new Worker(URL.createObjectURL(new Blob(
      [`(${SearchLib.Worker.source.toString()})()`],
      { type: 'text/javascript' }
    )));
    worker.onmessage = onmessage;
    worker.onerror = onerror;
    return worker;
  },

  source: function () {
    const libUrl = 'file:///html/toolbox/search/internal';
    self.importScripts('file:///html/toolbox/lodash.js');
    self.importScripts(`${libUrl}/library.min.js`);
    self.importScripts(`${libUrl}/engine.js`);
    self.importScripts(`${libUrl}/helper.js`);
    const map = BasSearchEngine.weights;

    self.onmessage = function (e) {
      if (e.data.type === 'initialize') {
        self.engine = new BasSearchEngine({
          documents: e.data.documents,
          fields: [
            { name: 'descriptions', weight: ({ type }) => map.descriptions[type] },
            { name: 'suggestions', weight: ({ type }) => map.suggestions[type] },
            { name: 'timestamps', weight: ({ type }) => map.timestamps[type] },
            { name: 'variables', weight: ({ type }) => map.variables[type] },
            { name: 'module', weight: ({ type }) => map.module[type] },
            { name: 'name', weight: ({ type }) => map.name[type] }
          ],
          distance: 0.3,
          limit: 500,
          ref: 'key'
        });

        postMessage({ success: true, type: e.data.type });
      }

      if (e.data.type === 'update') {
        if (self.engine) self.engine.history = e.data.history;
        postMessage({ success: true, type: e.data.type });
      }

      if (e.data.type === 'search') {
        const results = self.engine.search(e.data.query);
        postMessage({ success: true, type: e.data.type, results });
      }

      if (e.data.type === 'recent') {
        const results = self.engine.recent(e.data.query);
        postMessage({ success: true, type: e.data.type, results });
      }
    };
  }
}