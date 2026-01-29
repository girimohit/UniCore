import prisma from "@/lib/prisma";

export default async function Home() {
  // 🔹 TEMP: hardcode tenant code for testing
  const tenant = await prisma.tenant.findUnique({
    where: { code: "UDC" }, // Unicore Demo College
    include: {
      users: true,
    },
  });

  if (!tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-lg">Tenant not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center -mt-16">
      <h1 className="text-4xl font-bold mb-4 text-[#333333]">{tenant.name}</h1>

      <p className="mb-6 text-gray-600">Users in this tenant:</p>

      <ol className="list-decimal list-inside">
        {tenant.users.map((user) => (
          <li key={user.id} className="mb-2">
            <span className="font-medium text-black">{user.name}</span>{" "}
            <span className="text-gray-500">({user.role})</span>
            <span className="text-gray-500">({user.email})</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
