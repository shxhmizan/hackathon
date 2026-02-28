import { useState } from "react"
import { getCurrentUser } from "../services/user"
import { saveJob, uploadImage } from "../services/api"

export default function BagiKerja({ onJobCreated }) {
    const [form, setForm] = useState({
        job_type: "",
        title: "",
        description: "",
        gaji: "",
        contact_no: "",
    })
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [location, setLocation] = useState(null)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [locLoading, setLocLoading] = useState(false)

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    function handleImage(e) {
        const file = e.target.files[0]
        if (!file) return
        setImageFile(file)
        setImagePreview(URL.createObjectURL(file))
    }

    function getLocation() {
        setLocLoading(true)
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
                setLocLoading(false)
            },
            (err) => {
                console.error("Geolocation error:", err)
                // Fallback: KL center
                setLocation({ lat: 3.1415, lng: 101.6932 })
                setLocLoading(false)
            }
        )
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (!form.title || !form.gaji) return

        setLoading(true)
        try {
            const user = getCurrentUser()
            let image_url = ""

            if (imageFile) {
                image_url = await uploadImage(imageFile)
            }

            if (!location) {
                setLocation({ lat: 3.1415, lng: 101.6932 })
            }

            const jobData = {
                ...form,
                gaji: Number(form.gaji),
                image_url,
                location: location || { lat: 3.1415, lng: 101.6932 },
                owner_id: user.id,
                owner_name: user.name,
                executor_id: null,
            }

            await saveJob(jobData)
            setSuccess(true)
            setForm({ job_type: "", title: "", description: "", gaji: "", contact_no: "" })
            setImageFile(null)
            setImagePreview(null)

            setTimeout(() => {
                setSuccess(false)
                if (onJobCreated) onJobCreated()
            }, 2000)
        } catch (err) {
            console.error("Error creating job:", err)
            alert("Gagal mencipta tugasan. Cuba lagi.")
        } finally {
            setLoading(false)
        }
    }

    const JOB_TYPES = [
        "Pertukangan", "Pembersihan", "Penghantaran", "Baik Pulih",
        "Buruh Kasar", "Bantuan Kecemasan", "Lain-lain",
    ]

    return (
        <div className="w-full min-h-screen bg-white">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
                {/* Header */}
                <div className="mb-8 fade-in-up">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-bantu-dark leading-tight">
                        Bagi Kerja
                        <span className="text-bantu-orange flex items-center gap-2 mt-1">
                            Buat Tugasan Baru <i className="fa-solid fa-briefcase"></i>
                        </span>
                    </h2>
                    <p className="text-sm text-gray-500 mt-2 font-medium">
                        Isikan maklumat tugasan untuk paparkan di peta.
                    </p>
                </div>

                {/* Success */}
                {success && (
                    <div className="mb-6 p-5 bg-gradient-to-r from-teal-50 to-white rounded-2xl border border-teal-200 fade-in-up text-center">
                        <i className="fa-solid fa-circle-check text-bantu-teal text-3xl mb-2"></i>
                        <p className="font-bold text-bantu-teal">Tugasan berjaya dihantar! 🎉</p>
                        <p className="text-xs text-gray-400 mt-1">Tugasan anda kini ada di peta.</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5 fade-in-up" style={{ animationDelay: "0.1s" }}>
                    {/* Job Type */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Jenis Tugasan</label>
                        <div className="flex flex-wrap gap-2">
                            {JOB_TYPES.map((type) => (
                                <button
                                    type="button"
                                    key={type}
                                    onClick={() => setForm({ ...form, job_type: type })}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 ${form.job_type === type
                                            ? "bg-bantu-orange text-white shadow-glow"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Tajuk</label>
                        <input
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            className="w-full bg-gray-50 rounded-2xl px-5 py-3.5 text-sm font-medium outline-none border-2 border-transparent focus:border-bantu-orangeLight focus:bg-white transition-all"
                            placeholder="cth: Pasang Meja IKEA"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Penerangan</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full bg-gray-50 rounded-2xl px-5 py-3.5 text-sm font-medium outline-none border-2 border-transparent focus:border-bantu-orangeLight focus:bg-white transition-all resize-none"
                            placeholder="Jelaskan tugasan anda..."
                        ></textarea>
                    </div>

                    {/* Gaji + Contact */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Gaji (RM)</label>
                            <input
                                name="gaji"
                                type="number"
                                value={form.gaji}
                                onChange={handleChange}
                                className="w-full bg-gray-50 rounded-2xl px-5 py-3.5 text-sm font-medium outline-none border-2 border-transparent focus:border-bantu-orangeLight focus:bg-white transition-all"
                                placeholder="25"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">No. Telefon</label>
                            <input
                                name="contact_no"
                                value={form.contact_no}
                                onChange={handleChange}
                                className="w-full bg-gray-50 rounded-2xl px-5 py-3.5 text-sm font-medium outline-none border-2 border-transparent focus:border-bantu-orangeLight focus:bg-white transition-all"
                                placeholder="012-345 6789"
                            />
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Gambar (Opsional)</label>
                        <label className="flex items-center justify-center gap-3 w-full h-36 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 hover:border-bantu-orange cursor-pointer transition-all overflow-hidden">
                            {imagePreview ? (
                                <img src={imagePreview} alt="preview" className="w-full h-full object-cover rounded-2xl" />
                            ) : (
                                <div className="text-center text-gray-400">
                                    <i className="fa-solid fa-camera text-2xl mb-2"></i>
                                    <p className="text-xs font-semibold">Klik untuk muat naik</p>
                                </div>
                            )}
                            <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
                        </label>
                    </div>

                    {/* Location */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Lokasi</label>
                        {location ? (
                            <div className="bg-teal-50 rounded-2xl p-4 border border-teal-100 flex items-center gap-3">
                                <i className="fa-solid fa-location-dot text-bantu-teal text-lg"></i>
                                <div>
                                    <p className="text-sm font-bold text-gray-700">Lokasi diperolehi ✓</p>
                                    <p className="text-[10px] text-gray-400 font-mono">{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</p>
                                </div>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={getLocation}
                                disabled={locLoading}
                                className="w-full bg-gray-50 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-500 border-2 border-dashed border-gray-200 hover:border-bantu-teal hover:text-bantu-teal transition-all active:scale-[0.98]"
                            >
                                {locLoading ? (
                                    <><i className="fa-solid fa-spinner fa-spin mr-2"></i> Mendapatkan lokasi...</>
                                ) : (
                                    <><i className="fa-solid fa-crosshairs mr-2"></i> Dapatkan Lokasi Saya</>
                                )}
                            </button>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading || !form.title || !form.gaji}
                        className="w-full py-4 bg-bantu-dark text-white rounded-2xl font-bold text-base hover:bg-black active:scale-[0.98] transition-all shadow-soft disabled:opacity-40 disabled:cursor-not-allowed mt-2"
                    >
                        {loading ? (
                            <><i className="fa-solid fa-spinner fa-spin mr-2"></i> Menghantar...</>
                        ) : (
                            <>Hantar Tugasan <i className="fa-solid fa-paper-plane ml-2"></i></>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
