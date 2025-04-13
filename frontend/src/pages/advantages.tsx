const Advantages = () => {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-6">
        <h1 className="mb-12 text-center text-4xl font-extrabold text-gray-800">
          Les Avantages de Louer Votre Matériel Chez Nous
        </h1>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="transform rounded-lg bg-white p-6 shadow-lg transition-transform hover:scale-105">
            <h2 className="mb-4 text-xl font-semibold text-blue-700">
              Tarifs Compétitifs
            </h2>
            <p className="text-gray-700">
              Profitez de tarifs avantageux et économisez par rapport à l'achat
              de matériel. Nos offres de location sont conçues pour s'adapter à
              tous les budgets, avec des options flexibles pour répondre à vos
              besoins spécifiques.
            </p>
          </div>
          <div className="transform rounded-lg bg-white p-6 shadow-lg transition-transform hover:scale-105">
            <h2 className="mb-4 text-xl font-semibold text-blue-700">
              Équipement de Haute Qualité
            </h2>
            <p className="text-gray-700">
              Nous renouvelons régulièrement no tre parc de matériel pour vous
              offrir les dernières nouveautés en termes de technologie et de
              confort. Louer chez nous, c'est l'assurance de disposer d'un
              équipement en parfait état.
            </p>
          </div>
          <div className="transform rounded-lg bg-white p-6 shadow-lg transition-transform hover:scale-105">
            <h2 className="mb-4 text-xl font-semibold text-blue-700">
              Service Client Personnalisé
            </h2>
            <p className="text-gray-700">
              Notre équipe de professionnels est à votre écoute pour vous
              conseiller et vous aider à choisir le matériel le plus adapté à
              votre niveau et à vos envies. Nous prenons le temps de bien
              ajuster chaque équipement pour garantir votre sécurité et votre
              plaisir sur les pistes.
            </p>
          </div>
          <div className="transform rounded-lg bg-white p-6 shadow-lg transition-transform hover:scale-105">
            <h2 className="mb-4 text-xl font-semibold text-blue-700">
              Flexibilité et Commodité
            </h2>
            <p className="text-gray-700">
              Que vous souhaitiez louer à la journée, à la semaine ou pour une
              plus longue durée, nous avons des options flexibles pour répondre
              à vos besoins. De plus, en louant sur place, vous évitez les
              tracas du transport de matériel.
            </p>
          </div>
          <div className="transform rounded-lg bg-white p-6 shadow-lg transition-transform hover:scale-105">
            <h2 className="mb-4 text-xl font-semibold text-blue-700">
              Essai Avant Achat
            </h2>
            <p className="text-gray-700">
              Envie de tester avant d'investir dans du matériel ? La location
              est la solution idéale pour essayer différents modèles et marques.
              Si vous décidez d'acheter, nous vous proposons souvent des offres
              spéciales sur le matériel que vous avez loué.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Advantages;
