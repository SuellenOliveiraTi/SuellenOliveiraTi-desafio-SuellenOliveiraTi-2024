class RecintosZoo {
    constructor() {
        this.recintos = [
            { numero: 1, bioma: 'savana', tamanhoTotal: 10, animais: [{ especie: 'MACACO', quantidade: 3, tamanho: 1 }] },
            { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animais: [] },
            { numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animais: [{ especie: 'GAZELA', quantidade: 1, tamanho: 2 }] },
            { numero: 4, bioma: 'rio', tamanhoTotal: 8, animais: [] },
            { numero: 5, bioma: 'savana', tamanhoTotal: 9, animais: [{ especie: 'LEAO', quantidade: 1, tamanho: 3 }] },
        ];

        this.animais = {
            LEAO: { tamanho: 3, biomas: ['savana'], carnivoro: true },
            LEOPARDO: { tamanho: 2, biomas: ['savana'], carnivoro: true },
            CROCODILO: { tamanho: 3, biomas: ['rio'], carnivoro: true },
            MACACO: { tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
            GAZELA: { tamanho: 2, biomas: ['savana'], carnivoro: false },
            HIPOPOTAMO: { tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false, toleraOutrasEspeciesEmSavanaRio: true }
        };
    }

    analisaRecintos(especie, quantidade) {
        if (!this.animais[especie]) {
            return { erro: "Animal inválido", recintosViaveis: null };
        }
        if (quantidade <= 0) {
            return { erro: "Quantidade inválida", recintosViaveis: null };
        }

        const { tamanho, biomas, carnivoro, toleraOutrasEspeciesEmSavanaRio } = this.animais[especie];
        const tamanhoTotalNecessario = quantidade * tamanho;
        const recintosViaveis = [];

        for (const recinto of this.recintos) {
            const espacosOcupados = recinto.animais.reduce((acc, animal) => acc + (animal.quantidade * animal.tamanho), 0);
            let espacoExtra = (recinto.animais.length > 0 && !carnivoro) ? 1 : 0; // Considerar espaço extra se houver outras espécies
            const espacoLivre = recinto.tamanhoTotal - espacosOcupados - espacoExtra;

            // Verificar bioma
            if (!biomas.includes(recinto.bioma) && !(toleraOutrasEspeciesEmSavanaRio && recinto.bioma === 'savana e rio')) continue;

            // Verificar carnívoros
            if (carnivoro && recinto.animais.length > 0) continue;

            // Verificar coabitação para hipopótamos em bioma savana e rio
            if (especie === 'HIPOPOTAMO' && recinto.bioma !== 'savana e rio' && recinto.animais.length > 0) continue;

            // Verificar conforto de macacos com outras espécies
            if (especie === 'MACACO' && quantidade === 1 && recinto.animais.length === 0) continue;

            // Verificar se o espaço livre é suficiente
            if (espacoLivre >= tamanhoTotalNecessario) {
                recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanhoTotal})`);
            }
        }

        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável", recintosViaveis: null };
        }

        return { erro: null, recintosViaveis };
    }
}

export { RecintosZoo };

