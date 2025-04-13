export default function Station() {
  return (
    <main className="container mx-auto">
      <section className="mt-2 rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold">
          Bienvenue à La Mongie
        </h2>
        <p className="mb-6 text-center">
          La Mongie est l&apos;une des stations de ski les plus populaires des
          Pyrénées françaises. Située au pied du célèbre Col du Tourmalet, elle
          offre un accès direct au domaine skiable du Grand Tourmalet, le plus
          grand domaine skiable des Pyrénées françaises.
        </p>
        <div className="flex justify-center">
          <img
            src="/mongie.png"
            alt="La Mongie"
            className="mb-6 h-64 rounded-lg object-cover shadow-md"
          />
        </div>
        <p className="mb-4">
          La station est idéale pour les skieurs de tous niveaux, des débutants
          aux experts. Vous pourrez profiter de paysages magnifiques, de pistes
          bien entretenues et d&apos;une ambiance conviviale. En été, La Mongie
          se transforme en un paradis pour les randonneurs et les amoureux de la
          nature.
        </p>
        <p className="text-center text-lg font-semibold">
          Que vous soyez en quête de sensations fortes ou de détente, La Mongie
          a quelque chose à offrir à chacun. Venez découvrir nos installations
          modernes, nos restaurants chaleureux et notre accueil chaleureux. Nous
          vous attendons avec impatience !
        </p>
      </section>

      <section className="mb-12 flex flex-col items-center rounded-lg bg-blue-50 p-8 shadow-lg md:flex-row">
        <div className="mb-6 md:mb-0 md:w-1/2 md:pr-8">
          <h2 className="mb-4 text-3xl font-bold text-blue-600">
            Activités Hivernales
          </h2>
          <ul className="list-disc space-y-2 pl-6 text-blue-800">
            <li>Ski alpin et snowboard</li>
            <li>Ski de fond</li>
            <li>Randonnée en raquettes</li>
            <li>Balades en motoneige</li>
            <li>Parapente</li>
          </ul>
        </div>
        <div className="flex justify-center md:w-1/2">
          <img
            src="/ski.png"
            alt="Activités Hivernales"
            className="h-64 w-full max-w-md rounded-lg object-cover shadow-md"
          />
        </div>
      </section>

      <section className="mb-12 flex flex-col items-center rounded-lg bg-green-50 p-8 shadow-lg md:flex-row">
        <div className="order-2 flex justify-center md:order-1 md:w-1/2">
          <img
            src="/parapente.webp"
            alt="Activités Estivales"
            className="h-64 w-full max-w-md rounded-lg object-cover shadow-md"
          />
        </div>
        <div className="order-1 mb-6 md:order-2 md:mb-0 md:w-1/2 md:pl-8">
          <h2 className="mb-4 text-3xl font-bold text-green-600">
            Activités Estivales
          </h2>
          <ul className="list-disc space-y-2 pl-6 text-green-800">
            <li>Randonnée pédestre</li>
            <li>VTT</li>
            <li>Escalade</li>
            <li>Parapente</li>
            <li>Observation de la faune et de la flore</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
