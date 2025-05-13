import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaWhatsapp,
  FaArrowLeft,
} from "react-icons/fa";

const Contato = () => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    assunto: "",
    mensagem: "",
  });
  const [enviando, setEnviando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const [erro, setErro] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setErro("");

    // Simulação de envio (em produção usaríamos uma API real)
    setTimeout(() => {
      setEnviando(false);
      setMensagemSucesso(
        "Sua mensagem foi enviada com sucesso! Entraremos em contato em breve."
      );
      setFormData({
        nome: "",
        email: "",
        assunto: "",
        mensagem: "",
      });

      // Limpar mensagem de sucesso após 5 segundos
      setTimeout(() => {
        setMensagemSucesso("");
      }, 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Entre em Contato</h1>
          <Link
            to="/"
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Voltar para página principal
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-gray-600 mb-6">
              Estamos sempre dispostos a ouvir você! Se tiver dúvidas, sugestões
              ou quiser saber mais sobre o LeveFit, entre em contato conosco
              através de um dos canais abaixo ou preencha o formulário.
            </p>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">
                Informações de Contato
              </h2>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-green-100 text-green-600 p-2 rounded-md mr-4">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <h3 className="font-medium">Endereço</h3>
                    <p className="text-gray-600">
                      Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01310-100
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-green-100 text-green-600 p-2 rounded-md mr-4">
                    <FaPhoneAlt />
                  </div>
                  <div>
                    <h3 className="font-medium">Telefone</h3>
                    <p className="text-gray-600">(11) 3456-7890</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-green-100 text-green-600 p-2 rounded-md mr-4">
                    <FaEnvelope />
                  </div>
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-gray-600">contato@levefit.com.br</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-green-100 text-green-600 p-2 rounded-md mr-4">
                    <FaWhatsapp />
                  </div>
                  <div>
                    <h3 className="font-medium">WhatsApp</h3>
                    <p className="text-gray-600">(11) 98765-4321</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">
                Horário de Atendimento
              </h2>
              <p className="text-gray-600 mb-2">Segunda a Sexta: 9h às 18h</p>
              <p className="text-gray-600">Sábado: 9h às 13h</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Envie uma Mensagem</h2>

            {mensagemSucesso && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {mensagemSucesso}
              </div>
            )}

            {erro && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {erro}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Nome Completo*
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Email*
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Assunto*
                </label>
                <select
                  name="assunto"
                  value={formData.assunto}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Selecione um assunto</option>
                  <option value="Dúvida">Dúvida</option>
                  <option value="Sugestão">Sugestão</option>
                  <option value="Reclamação">Reclamação</option>
                  <option value="Parceria">Parceria</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Mensagem*
                </label>
                <textarea
                  name="mensagem"
                  value={formData.mensagem}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={enviando}
                className={`w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors ${
                  enviando ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {enviando ? "Enviando..." : "Enviar Mensagem"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contato;
