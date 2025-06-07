# NyaySetu Legal Chatbot - Integrated Responses

This document details how the NyaySetu legal chatbot has been enhanced to handle various sample queries in multiple languages using the Bhashini API.

## Integrated Sample Queries

The system now responds to the following sample queries in various languages:

### English Queries

1. **"How do I file an FIR?"**

   - Enhanced answer that includes details on bringing ID proof and evidence.

2. **"What are my rights if I am arrested?"**

   - Complete answer covering all legal rights including the right to remain silent.

3. **"How can I apply for legal aid in India?"**

   - Detailed response with eligibility criteria, application process, and required documents.

4. **"What are the steps for filing a consumer complaint?"**

   - Comprehensive steps with specifics on which commission to approach based on claim amounts.

5. **"What documents are needed for property registration?"**
   - Numbered list of all required documents with additional details.

### Hindi Queries

1. **"मुझे FIR दर्ज करने के बारे में जानकारी चाहिए"**

   - Full response in Hindi about filing FIR.

2. **"संपत्ति पंजीकरण के लिए क्या दस्तावेज़ आवश्यक हैं?"**

   - Complete answer in Hindi listing all documents needed for property registration.

3. **"गिरफ्तारी के समय मेरे क्या अधिकार हैं?"**
   - Hindi response about arrest rights.

### Bengali Queries

1. **"আমি কিভাবে একটি FIR দাখিল করব?"**

   - Bengali response about filing an FIR.

2. **"গ্রেপ্তার হলে আমার কী অধিকার আছে?"**
   - Bengali response about arrest rights.

### Tamil Queries

1. **"FIR பதிவு செய்வது எப்படி?"**

   - Tamil response about filing an FIR.

2. **"கைது செய்யப்பட்டால் என் உரிமைகள் என்ன?"**
   - Tamil response about arrest rights.

### Telugu Queries

1. **"భారతదేశంలో ఉచిత చట్ట సహాయం కోసం నేను ఎలా దరఖాస్తు చేసుకోవాలి?"**
   - Telugu response about applying for legal aid.

## Language Detection and Response Logic

The system has been enhanced with the following capabilities:

1. **Automatic Language Detection**: The backend now automatically detects the language of the incoming query.

2. **Same-Language Response**: Responses are always generated in the same language as the query.

3. **Keyword Matching in Multiple Languages**: The system can identify keywords in Hindi, Bengali, Tamil, and Telugu.

4. **Bhashini API Integration**: For queries that don't match our database, the system uses Bhashini API to generate responses.

5. **Fallback Mechanisms**: If the Bhashini API fails, the system has language-specific fallback responses.

## Using the Enhanced Chatbot

When interacting with the chatbot:

1. Users can type or speak their query in any supported language.
2. The system automatically detects the language and responds in the same language.
3. For voice interactions, text-to-speech will read out the response in the appropriate language.

## API Response Flow

1. User submits a query
2. Server detects the language
3. Server searches for keyword matches in the appropriate language
4. If a match is found, returns the pre-defined response
5. If no match is found, calls the Bhashini API
6. Ensures response is in the same language as the query
7. Returns the response to the frontend

This integration ensures that all the sample queries are answered appropriately and in the correct language, providing a seamless multilingual experience for users seeking legal assistance.
