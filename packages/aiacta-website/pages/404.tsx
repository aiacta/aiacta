export default function Error404() {
  return (
    <div
      className="mx-auto container max-w-screen-sm"
      style={{
        marginTop: 'calc(50vh - 200px)',
        marginBottom: 'calc(50vh - 225px)',
      }}
    >
      <div>
        <h1 className="inline-block text-2xl font-medium align-top border-r-2 border-solid border-gray-200 mr-5 pt-2 pb-2 pr-6">
          404
        </h1>
        <div className="inline-block text-left pt-1 pb-1">
          <h2 className="text-sm leading-10 p-0 m-0">
            This page could not be found.
          </h2>
        </div>
      </div>
    </div>
  );
}
