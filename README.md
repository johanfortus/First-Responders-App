# ARC: Action, Resources, Care  
*A confidential check-in and resource app for first responders*  

---

## 💡 Inspiration  
ARC was inspired by the lived experiences of firefighters in our team’s families. First responders face repeated exposure to high-intensity and emotionally difficult calls.  

Studies show first responders are more likely to die by suicide than in the line of duty. To validate this need, we interviewed **41 first responders**:  

- **61%** knew of department resources but do not use them.  
- **41%** said a call sometimes affects them after shift.  
- Top barriers: **40% stigma/fear of judgment**, **27.5% discomfort talking directly to someone**.  
- **78%** rated 3 or above (out of 5) on usefulness of an app like this.  
- Over **50%** chose peer mentor chat and therapist scheduling as their top desired features.

## ⚙️ What it Does  
ARC is a mobile app that:  
- Provides **quick, confidential app-based check-ins** after difficult calls (AI-enhanced).  
- Lets users indicate if they’re **OK or not OK**, with guided follow-up options.  
- Connects responders to **union therapists, personal therapists, peer mentors, or trusted contacts**.  
- Includes a **resources library**: hotlines, guides, articles, and videos.  
- Offers a **chatbot** for grounding tips and micro check-ins.  
- Keeps everything **confidential, user-driven, and stigma-reducing**.  

---

## 🛠️ How We Built It  
- **Frontend**: React Native with Expo + TypeScript  
- **Navigation**: Expo Router (onboarding, login, home, check-in, resources, contacts, profile)  
- **Auth**: Auth0 for secure login  
- **Design**: Figma wireframes, firefighter-inspired color palette (navy + orange), Poppins typography  
- **Prototype AI**: in-app chatbox for support tips and grounding exercises  
- **Backend (prototype)**: Node.js lightweight endpoints for storing profile + scheduling

---

## 🚀 Features  
- Confidential **AI-powered check-ins**  
- **Peer mentor chat** in-app  
- **Therapist scheduling** (calls, texts, appointments)  
- **Emergency/trusted contact notifications** after tough calls  
- **Resource hub** with guides, articles, hotlines, and videos  
- Custom **bottom navigation bar** for quick access  
