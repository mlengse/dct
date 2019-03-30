const indikator = ['kb', 'salinFaskes', 'imun', 'ab', 'jamban', 'rokok', 'asi', 'tumbuh', 'tb', 'ht', 'jkn', 'jiwa'];
const nilai = ['y', 'penyebut', 'iks'];
export const state = () => ({
  iksList: [],
  iks: {},
  jmlkk: [{"rw":1,"rt":1,"jmlKK":146},{"rw":1,"rt":2,"jmlKK":68},{"rw":1,"rt":3,"jmlKK":132},{"rw":1,"rt":4,"jmlKK":142},{"rw":1,"rt":"Semua","jmlKK":488},{"rw":2,"rt":1,"jmlKK":60},{"rw":2,"rt":2,"jmlKK":45},{"rw":2,"rt":3,"jmlKK":86},{"rw":2,"rt":4,"jmlKK":121},{"rw":2,"rt":5,"jmlKK":154},{"rw":2,"rt":"Semua","jmlKK":466},{"rw":3,"rt":1,"jmlKK":66},{"rw":3,"rt":2,"jmlKK":82},{"rw":3,"rt":3,"jmlKK":137},{"rw":3,"rt":4,"jmlKK":85},{"rw":3,"rt":5,"jmlKK":130},{"rw":3,"rt":6,"jmlKK":72},{"rw":3,"rt":"Semua","jmlKK":572},{"rw":4,"rt":1,"jmlKK":78},{"rw":4,"rt":2,"jmlKK":176},{"rw":4,"rt":3,"jmlKK":181},{"rw":4,"rt":4,"jmlKK":186},{"rw":4,"rt":5,"jmlKK":60},{"rw":4,"rt":"Semua","jmlKK":681},{"rw":5,"rt":1,"jmlKK":85},{"rw":5,"rt":2,"jmlKK":101},{"rw":5,"rt":3,"jmlKK":78},{"rw":5,"rt":4,"jmlKK":142},{"rw":5,"rt":"Semua","jmlKK":406},{"rw":6,"rt":1,"jmlKK":63},{"rw":6,"rt":2,"jmlKK":184},{"rw":6,"rt":3,"jmlKK":170},{"rw":6,"rt":4,"jmlKK":71},{"rw":6,"rt":5,"jmlKK":14},{"rw":6,"rt":6,"jmlKK":57},{"rw":6,"rt":7,"jmlKK":62},{"rw":6,"rt":"Semua","jmlKK":621},{"rw":7,"rt":1,"jmlKK":225},{"rw":7,"rt":2,"jmlKK":72},{"rw":7,"rt":3,"jmlKK":325},{"rw":7,"rt":4,"jmlKK":300},{"rw":7,"rt":5,"jmlKK":185},{"rw":7,"rt":6,"jmlKK":140},{"rw":7,"rt":7,"jmlKK":57},{"rw":7,"rt":8,"jmlKK":38},{"rw":7,"rt":9,"jmlKK":205},{"rw":7,"rt":"Semua","jmlKK":1547},{"rw":8,"rt":1,"jmlKK":52},{"rw":8,"rt":2,"jmlKK":73},{"rw":8,"rt":3,"jmlKK":78},{"rw":8,"rt":4,"jmlKK":59},{"rw":8,"rt":5,"jmlKK":109},{"rw":8,"rt":6,"jmlKK":72},{"rw":8,"rt":7,"jmlKK":61},{"rw":8,"rt":"Semua","jmlKK":504},{"rw":9,"rt":1,"jmlKK":48},{"rw":9,"rt":2,"jmlKK":70},{"rw":9,"rt":3,"jmlKK":72},{"rw":9,"rt":4,"jmlKK":184},{"rw":9,"rt":5,"jmlKK":201},{"rw":9,"rt":6,"jmlKK":107},{"rw":9,"rt":7,"jmlKK":58},{"rw":9,"rt":8,"jmlKK":158},{"rw":9,"rt":9,"jmlKK":35},{"rw":9,"rt":"Semua","jmlKK":933},{"rw":10,"rt":1,"jmlKK":43},{"rw":10,"rt":2,"jmlKK":76},{"rw":10,"rt":3,"jmlKK":47},{"rw":10,"rt":"Semua","jmlKK":166},{"rw":11,"rt":1,"jmlKK":111},{"rw":11,"rt":2,"jmlKK":74},{"rw":11,"rt":3,"jmlKK":169},{"rw":11,"rt":4,"jmlKK":69},{"rw":11,"rt":5,"jmlKK":102},{"rw":11,"rt":6,"jmlKK":89},{"rw":11,"rt":"Semua","jmlKK":614},{"rw":12,"rt":1,"jmlKK":133},{"rw":12,"rt":2,"jmlKK":99},{"rw":12,"rt":3,"jmlKK":86},{"rw":12,"rt":4,"jmlKK":104},{"rw":12,"rt":5,"jmlKK":153},{"rw":12,"rt":6,"jmlKK":208},{"rw":12,"rt":7,"jmlKK":50},{"rw":12,"rt":8,"jmlKK":106},{"rw":12,"rt":9,"jmlKK":41},{"rw":12,"rt":"Semua","jmlKK":980},{"rw":13,"rt":1,"jmlKK":76},{"rw":13,"rt":2,"jmlKK":44},{"rw":13,"rt":3,"jmlKK":68},{"rw":13,"rt":4,"jmlKK":39},{"rw":13,"rt":5,"jmlKK":49},{"rw":13,"rt":"Semua","jmlKK":276},{"rw":14,"rt":1,"jmlKK":70},{"rw":14,"rt":2,"jmlKK":95},{"rw":14,"rt":3,"jmlKK":52},{"rw":14,"rt":4,"jmlKK":55},{"rw":14,"rt":"Semua","jmlKK":272},{"rw":15,"rt":1,"jmlKK":51},{"rw":15,"rt":2,"jmlKK":64},{"rw":15,"rt":3,"jmlKK":61},{"rw":15,"rt":4,"jmlKK":34},{"rw":15,"rt":"Semua","jmlKK":210},{"rw":16,"rt":1,"jmlKK":62},{"rw":16,"rt":2,"jmlKK":61},{"rw":16,"rt":3,"jmlKK":78},{"rw":16,"rt":4,"jmlKK":57},{"rw":16,"rt":5,"jmlKK":80},{"rw":16,"rt":"Semua","jmlKK":338},{"rw":17,"rt":1,"jmlKK":89},{"rw":17,"rt":2,"jmlKK":71},{"rw":17,"rt":3,"jmlKK":58},{"rw":17,"rt":4,"jmlKK":54},{"rw":17,"rt":"Semua","jmlKK":272},{"rw":18,"rt":1,"jmlKK":64},{"rw":18,"rt":2,"jmlKK":54},{"rw":18,"rt":3,"jmlKK":34},{"rw":18,"rt":4,"jmlKK":60},{"rw":18,"rt":5,"jmlKK":65},{"rw":18,"rt":"Semua","jmlKK":277},{"rw":19,"rt":1,"jmlKK":86},{"rw":19,"rt":2,"jmlKK":57},{"rw":19,"rt":3,"jmlKK":62},{"rw":19,"rt":4,"jmlKK":72},{"rw":19,"rt":5,"jmlKK":109},{"rw":19,"rt":"Semua","jmlKK":386},{"rw":20,"rt":1,"jmlKK":""},{"rw":20,"rt":2,"jmlKK":55},{"rw":20,"rt":3,"jmlKK":70},{"rw":20,"rt":4,"jmlKK":77},{"rw":20,"rt":"Semua","jmlKK":202},{"rw":21,"rt":1,"jmlKK":78},{"rw":21,"rt":2,"jmlKK":67},{"rw":21,"rt":3,"jmlKK":67},{"rw":21,"rt":4,"jmlKK":51},{"rw":21,"rt":"Semua","jmlKK":263},{"rw":22,"rt":1,"jmlKK":53},{"rw":22,"rt":2,"jmlKK":43},{"rw":22,"rt":3,"jmlKK":70},{"rw":22,"rt":4,"jmlKK":59},{"rw":22,"rt":"Semua","jmlKK":225},{"rw":23,"rt":1,"jmlKK":39},{"rw":23,"rt":2,"jmlKK":60},{"rw":23,"rt":3,"jmlKK":66},{"rw":23,"rt":4,"jmlKK":62},{"rw":23,"rt":5,"jmlKK":65},{"rw":23,"rt":"Semua","jmlKK":292},{"rw":24,"rt":1,"jmlKK":36},{"rw":24,"rt":2,"jmlKK":78},{"rw":24,"rt":3,"jmlKK":64},{"rw":24,"rt":4,"jmlKK":60},{"rw":24,"rt":"Semua","jmlKK":238},{"rw":25,"rt":1,"jmlKK":49},{"rw":25,"rt":2,"jmlKK":49},{"rw":25,"rt":3,"jmlKK":60},{"rw":25,"rt":4,"jmlKK":55},{"rw":25,"rt":5,"jmlKK":62},{"rw":25,"rt":6,"jmlKK":20},{"rw":25,"rt":"Semua","jmlKK":295},{"rw":26,"rt":1,"jmlKK":55},{"rw":26,"rt":2,"jmlKK":71},{"rw":26,"rt":3,"jmlKK":51},{"rw":26,"rt":4,"jmlKK":91},{"rw":26,"rt":5,"jmlKK":59},{"rw":26,"rt":6,"jmlKK":43},{"rw":26,"rt":"Semua","jmlKK":370},{"rw":27,"rt":1,"jmlKK":96},{"rw":27,"rt":2,"jmlKK":115},{"rw":27,"rt":3,"jmlKK":113},{"rw":27,"rt":4,"jmlKK":41},{"rw":27,"rt":5,"jmlKK":36},{"rw":27,"rt":6,"jmlKK":58},{"rw":27,"rt":"Semua","jmlKK":459},{"rw":28,"rt":1,"jmlKK":45},{"rw":28,"rt":2,"jmlKK":28},{"rw":28,"rt":3,"jmlKK":41},{"rw":28,"rt":4,"jmlKK":38},{"rw":28,"rt":5,"jmlKK":70},{"rw":28,"rt":6,"jmlKK":59},{"rw":28,"rt":"Semua","jmlKK":281},{"rw":29,"rt":1,"jmlKK":158},{"rw":29,"rt":2,"jmlKK":104},{"rw":29,"rt":3,"jmlKK":73},{"rw":29,"rt":"Semua","jmlKK":335},{"rw":30,"rt":1,"jmlKK":158},{"rw":30,"rt":2,"jmlKK":82},{"rw":30,"rt":3,"jmlKK":57},{"rw":30,"rt":4,"jmlKK":79},{"rw":30,"rt":"Semua","jmlKK":376},{"rw":31,"rt":1,"jmlKK":135},{"rw":31,"rt":2,"jmlKK":71},{"rw":31,"rt":3,"jmlKK":40},{"rw":31,"rt":4,"jmlKK":67},{"rw":31,"rt":5,"jmlKK":100},{"rw":31,"rt":"Semua","jmlKK":413},{"rw":32,"rt":1,"jmlKK":130},{"rw":32,"rt":2,"jmlKK":160},{"rw":32,"rt":3,"jmlKK":63},{"rw":32,"rt":4,"jmlKK":56},{"rw":32,"rt":5,"jmlKK":58},{"rw":32,"rt":6,"jmlKK":22},{"rw":32,"rt":"Semua","jmlKK":489},{"rw":33,"rt":1,"jmlKK":47},{"rw":33,"rt":2,"jmlKK":46},{"rw":33,"rt":3,"jmlKK":46},{"rw":33,"rt":4,"jmlKK":47},{"rw":33,"rt":"Semua","jmlKK":186},{"rw":34,"rt":1,"jmlKK":165},{"rw":34,"rt":2,"jmlKK":88},{"rw":34,"rt":3,"jmlKK":166},{"rw":34,"rt":"Semua","jmlKK":419},{"rw":35,"rt":1,"jmlKK":84},{"rw":35,"rt":2,"jmlKK":93},{"rw":35,"rt":3,"jmlKK":66},{"rw":35,"rt":4,"jmlKK":84},{"rw":35,"rt":"Semua","jmlKK":327},{"rw":36,"rt":1,"jmlKK":86},{"rw":36,"rt":2,"jmlKK":61},{"rw":36,"rt":3,"jmlKK":61},{"rw":36,"rt":"Semua","jmlKK":208},{"rw":37,"rt":1,"jmlKK":82},{"rw":37,"rt":2,"jmlKK":66},{"rw":37,"rt":3,"jmlKK":116},{"rw":37,"rt":"Semua","jmlKK":264},{"rw":38,"rt":1,"jmlKK":0},{"rw":38,"rt":2,"jmlKK":0},{"rw":38,"rt":3,"jmlKK":0},{"rw":38,"rt":"Semua","jmlKK":0},{"rw":39,"rt":1,"jmlKK":0},{"rw":39,"rt":2,"jmlKK":0},{"rw":39,"rt":3,"jmlKK":0},{"rw":39,"rt":"Semua","jmlKK":0},{"rw":"Semua","rt":"Semua","jmlKK":15651}]
})

export const mutations = {
  add( { iks, iksList }, res){
    res.map((e, i) => indikator.map(o => nilai.map(f => {
      if (f == 'penyebut' && e[o][f] == 0) res[i][o]['iks'] = null
    })))
    for( let r of res) {
      iksList.indexOf(r._key) < 0 && iksList.push(r._key)
      iks[r._key] = r
    }
  }
}

export const getters = {
  iksList: ({ iksList, iks }) => iksList.map(iksId => iks[iksId]),
  iks: ({ iks }) => iksId => iks[iksId],
  kel: ({ iksList, iks }) => [...new Set(iksList.map(iksId => iks[iksId].kel))].sort(),
  rw: ({ iksList, iks }) => ({ kel }) => [...new Set(iksList.map(iksId => iks[iksId].kel === kel ? iks[iksId].rw === 'Semua' ? 'Semua' : Number(iks[iksId].rw) : 'Semua'))].sort((a, b) => a - b),
  rt: ({ iksList, iks }) => ({ kel, rw }) => [...new Set(iksList.map(iksId => iks[iksId].kel === kel ? iks[iksId].rw === rw ? iks[iksId].rt === 'Semua' ? 'Semua' : Number(iks[iksId].rt) : 'Semua' : 'Semua'))].sort((a, b) => a - b)
}

export const actions = {
  async all(store){
    let { data } = await this.$axios.get(`${process.env.API_SIBELA}/api/iks`, {}, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    })
    store.commit('add', data)
  },
  async tb(store, token){
    let { data } = await this.$axios.get(
			`${process.env.API_SIBELA}/gql`,
			{},
			{
				headers: {
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${token}`
				}
			}
		);
  }
}