const each = ['no', 'bagian', 'do', 'rumus', 'pembilang', 'penyebut', 'pengali', 'operator', 'target', 'satuan', 'lokasi', 'pj']
function getFixed(numb) {
	let num = Number(numb);
	if(!numb) return '0';
	if(!num) return numb;
	if(num%1 == 0) return num;
	if(num.toFixed(1).toString() > '0.1') return num.toFixed(1);
	if(num.toFixed(2).toString() > '0.01') return num.toFixed(2);
	if(num.toFixed(3).toString() > '0.001') return num.toFixed(3);
	if(num.toFixed(4).toString() > '0.0001') return num.toFixed(4);
}

function lowerCase(string) {
	let fix = ['KIA', 'TB', 'DB', 'HIV', 'PTM'];
	return string.split(' ').map(e=> {
		if( fix.indexOf(e) == -1 ) {
			return e.charAt(0) + e.slice(1).toLowerCase();
		} else {
			return e
		}
	}).join(' ')
}
export const state = () => ({
  spmList: [],
  spm: {},
  bagian: [],
  ind: {},
  indDet: []
})

export const getters = {
  spmList: ({ spmList, spm }) => spmList.map(spmId => spm[spmId]),
  spm: ({ spm }) => spmId => spm[spmId],
  ind: ({ind}) => indId => ind[indId],
  bagian: ({ spmList, spm }) => [ 'Semua', ...[...new Set(spmList.map(spmId => spm[spmId].bagian))].sort()],
}

export const mutations = {
  addIndDet({ indDet }, e) {
    e.map(o=> {
      if(indDet.indexOf(JSON.stringify(o)) < 0) indDet.push(JSON.stringify(o))
    })
  },
  addInd({ ind }, e) {
    ind[e._key] = []
    for(let i in e) if(each.indexOf(i)>-1 || i == 'indikatorbaru' || i == 'indikatorlama'){
      let o = e[i]
      if(i == 'bagian') o = lowerCase(o)
      if(i == 'target') o = getFixed(o)
      if(i == 'satuan' && e[i] == 'persen' || e[i] == 'Persen') o = '%'
      if(i === 'indikatorbaru' || i === 'indikatorlama ') i = 'uraian'
      if( i === 'do') i = 'definisi operaional'
      ind[e._key].push({
        key: i,
        desc: o
      })
    }  
  },
  addSpm({ spmList, spm}, res) {
    for (let r of res) {
      let id = r.kode
      spmList.indexOf(id) < 0 && spmList.push(id)
      spm[id] = r
    }
  },
}

export const actions = {
  async all( store, bulan){
    let { data } = await this.$axios.get(`${process.env.API_SIBELA}/api/capaian-${bulan}-${this.$moment().format('YYYY')}`, {}, {
      headers: {
        'Acess-Control-Allow-Origin': '*',
      }
    })
    store.commit('addSpm', data)

  },
  async indDet( store, key ){
    let { data } = await this.$axios.get(`${process.env.API_SIBELA}/api/detail-${key}-${this.$moment().format('YYYY')}`, {}, {
      headers: {
        'Acess-Control-Allow-Origin': '*',
      }
    })
    store.commit('addIndDet', data)
  },
  async ind( store, key ){
    let { data } = await this.$axios.get(`${process.env.API_SIBELA}/api/${key}-${this.$moment().format('YYYY')}`, {}, {
      headers: {
        'Acess-Control-Allow-Origin': '*',
      }
    })
    store.commit('addInd', data[0])
  }
}