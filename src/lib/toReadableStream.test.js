import {expect} from 'chai';
import sinon from 'sinon';
// import {marbles} from 'rxjs-marbles/mocha';
import {of} from 'rxjs';
import {parse as csvParse} from 'csv-parse';

import toReadableStream from './toReadableStream';

describe('toReadableStream', () => {
  it('should export a function', () => {
    expect(toReadableStream).to.be.a('function');
  });

  it('should convert simple RxJS Observable into a Readable', done => {
    const onData = sinon.spy();
    const onError = sinon.spy();
    const sample = [
      'foo',
      'bar',
    ];
    const input$ = of(...sample);
    const rs = toReadableStream(input$);
    rs
      .on('data', onData)
      .on('error', console.trace)
      .on('close', () => {
        expect(onData.callCount).to.equal(2);
        expect(onData.getCall(0).args[0].toString()).to.equal('foo');
        expect(onData.getCall(1).args[0].toString()).to.equal('bar');
        done();
      })
  });

  it('should work with a standard node.js stream pipe', done => {
    const onData = sinon.spy();
    const onError = sinon.spy();
    const samples = [
      '"name","systolicBp","diastolicBp","motto"\n',
      '"Blackbeard",140,91,"Yarr"\n',
      '"Crunch",120,80,"Arr"\n',
      '"Sparrow",110,70,"Savvy"\n',
      '"Charles Vayne",200,100,"Stab first ask questions later"\n',
    ];
    const input$ = of(...samples);
    const rs = toReadableStream(input$);
    const parser = csvParse({
      columns: true,
      cast: true,
      cast_date: false,
    });
    rs.pipe(parser)
      .on('data', onData)
      .on('error', console.trace)
      .on('end', () => {
        expect(onData.callCount).to.equal(4);
        expect(onData.getCall(0).args[0]).to.deep.equal({
          name: 'Blackbeard', systolicBp: 140, diastolicBp: 91, motto: 'Yarr'
        });
        expect(onData.getCall(3).args[0]).to.deep.equal({
          name: 'Charles Vayne', systolicBp: 200, diastolicBp: 100, motto: 'Stab first ask questions later'
        });
        done();
      });
  });
});
