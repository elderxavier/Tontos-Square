package es.esy.elderxavier.mlp;

import java.io.FileNotFoundException;

public class Executor {

	private static double TREINO[][] = {
		{0, 0, 1, 1},
		{0, 1, 0, 1},
		{1, 1, 1, 1}
	};
	
	private static double ESPERADOS[] = {0, 1, 1, 1};
	
	public static void main(String[] args) throws FileNotFoundException {
		int nrNeuroniosCamadaIntermediaria = 4;
		int nrNeuroniosEntrada = 3;

		RedeNeural rede = new RedeNeural(nrNeuroniosCamadaIntermediaria, nrNeuroniosEntrada);
		
		System.out.println("Treinando...");
		rede.treinar(TREINO, ESPERADOS);
		
		System.out.println("Teste:");
		rede.classificar(new double[] { 0, 0, 1 });
	}

}