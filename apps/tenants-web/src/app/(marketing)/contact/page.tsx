"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

const contactInfo = [
  {
    icon: Phone,
    title: "전화 문의",
    content: "02-1234-5678",
    description: "평일 09:00 - 18:00",
  },
  {
    icon: Mail,
    title: "이메일",
    content: "contact@conexgrow.com",
    description: "24시간 접수 가능",
  },
  {
    icon: MapPin,
    title: "본사 위치",
    content: "서울특별시 강남구 테헤란로 123",
    description: "CXG 빌딩 10층",
  },
  {
    icon: Clock,
    title: "운영 시간",
    content: "평일 09:00 - 18:00",
    description: "주말 및 공휴일 휴무",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    employees: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    // 실제로는 API 호출을 여기서 수행
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Form submitted:", formData);
      setSubmitStatus("success");
      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        employees: "",
        message: "",
      });
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              언제든지
              <br />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                문의해주세요
              </span>
            </h1>
            <p className="mb-8 text-lg text-slate-600 sm:text-xl">
              ConexGrow에 대해 궁금한 점이 있으신가요?
              <br />
              전문 상담사가 친절하게 답변해드리겠습니다.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="border-y border-slate-200 bg-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {contactInfo.map((info) => (
              <div
                key={info.title}
                className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center"
              >
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-indigo-100 p-3">
                    <info.icon className="h-6 w-6 text-indigo-600" />
                  </div>
                </div>
                <h3 className="mb-2 text-sm font-semibold text-slate-500">
                  {info.title}
                </h3>
                <p className="mb-1 text-lg font-bold text-slate-900">
                  {info.content}
                </p>
                <p className="text-sm text-slate-600">{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="bg-slate-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
            {/* Left Column - Form */}
            <div>
              <h2 className="mb-6 text-3xl font-bold text-slate-900">
                상담 신청하기
              </h2>
              <p className="mb-8 text-slate-600">
                아래 양식을 작성해주시면 영업일 기준 24시간 내에 연락드리겠습니다.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      이름 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                      placeholder="홍길동"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="company"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      회사명 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      required
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                      placeholder="(주)회사명"
                    />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      이메일 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                      placeholder="email@company.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      연락처 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                      placeholder="010-1234-5678"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="employees"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    직원 수
                  </label>
                  <select
                    id="employees"
                    name="employees"
                    value={formData.employees}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                  >
                    <option value="">선택해주세요</option>
                    <option value="1-10">1-10명</option>
                    <option value="11-30">11-30명</option>
                    <option value="31-50">31-50명</option>
                    <option value="51+">51명 이상</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    문의 내용 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                    placeholder="궁금하신 내용을 자유롭게 작성해주세요."
                  />
                </div>

                {submitStatus === "success" && (
                  <div className="rounded-lg bg-green-50 p-4 text-green-800">
                    문의가 성공적으로 접수되었습니다. 빠른 시일 내에
                    연락드리겠습니다.
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="rounded-lg bg-red-50 p-4 text-red-800">
                    문의 접수 중 오류가 발생했습니다. 다시 시도해주세요.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-indigo-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>처리 중...</>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      문의하기
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right Column - Additional Info */}
            <div className="space-y-8">
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <h3 className="mb-4 text-xl font-bold text-slate-900">
                  빠른 답변을 위한 팁
                </h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-indigo-600">•</span>
                    <span>
                      회사 규모와 업종을 함께 알려주시면 더 정확한 상담이
                      가능합니다.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-indigo-600">•</span>
                    <span>
                      현재 사용 중인 시스템이 있다면 함께 말씀해주세요.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-indigo-600">•</span>
                    <span>도입 시기를 알려주시면 맞춤 제안이 가능합니다.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-indigo-600">•</span>
                    <span>
                      예산 범위를 공유해주시면 최적의 플랜을 추천드립니다.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50 to-purple-50 p-8">
                <h3 className="mb-4 text-xl font-bold text-slate-900">
                  무료 데모 신청
                </h3>
                <p className="mb-6 text-slate-600">
                  실제 시스템을 체험해보고 싶으신가요? 전문가와 함께하는 1:1
                  맞춤 데모를 신청하세요.
                </p>
                <ul className="mb-6 space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                    30분 온라인 화상 상담
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                    실제 업무 시나리오 시연
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                    맞춤형 견적 제공
                  </li>
                </ul>
                <p className="text-sm text-slate-500">
                  문의 메시지에 "데모 희망"이라고 작성해주세요.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <h3 className="mb-4 text-xl font-bold text-slate-900">
                  자주 묻는 질문
                </h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="mb-1 font-semibold text-slate-900">
                      Q. 도입까지 얼마나 걸리나요?
                    </p>
                    <p className="text-slate-600">
                      A. 평균 2-4주 정도 소요됩니다. 기업 규모와 커스터마이징
                      범위에 따라 달라질 수 있습니다.
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 font-semibold text-slate-900">
                      Q. 기존 시스템 데이터 이관이 가능한가요?
                    </p>
                    <p className="text-slate-600">
                      A. 네, 무료로 데이터 마이그레이션을 지원해드립니다.
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 font-semibold text-slate-900">
                      Q. 교육은 어떻게 진행되나요?
                    </p>
                    <p className="text-slate-600">
                      A. 온라인/오프라인 교육과 동영상 가이드를 제공합니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
