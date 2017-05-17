package br.com.dextra.redeneural.treinamento;

import org.junit.Assert;
import org.junit.Test;

import br.com.dextra.redeneural.estrutura.TestPerceptronMultiplasCamadas;

public class TestBackPropagation {

	@Test
	public void testClassificar() {
		BackPropagation backPropagation = new FakeBackPropagation(4, 3, 2);
		Double sinal[] = backPropagation.classificar(new Double[] { 1d, 1d, 1d, 1d });
		Assert.assertArrayEquals(new Double[]{12.0, 12.0}, sinal);
	}

	class FakeBackPropagation extends BackPropagation {
		public FakeBackPropagation(Integer nrEntradas, Integer nrNeuroniosCamadaIntermediaria, Integer nrNeuroniosCamadaSaida) {
			super(nrEntradas, nrNeuroniosCamadaIntermediaria, nrNeuroniosCamadaSaida);
			this.mlp = new TestPerceptronMultiplasCamadas().new FakePerceptronMultiplasCamadas(nrEntradas, nrNeuroniosCamadaIntermediaria, nrNeuroniosCamadaSaida);
		}
	}

}