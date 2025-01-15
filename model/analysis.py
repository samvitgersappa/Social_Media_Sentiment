import sys
import json
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from transformers import pipeline

# Download necessary NLTK data files
nltk.download("punkt")
nltk.download("stopwords")

# Use a more advanced pre-trained model for sentiment analysis
sentiment_analysis = pipeline(
    "sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english"
)


def preprocess_text(text):
    # Tokenize the text
    words = word_tokenize(text)
    # Remove stopwords
    stop_words = set(stopwords.words("english"))
    filtered_words = [word for word in words if word.lower() not in stop_words]
    # Join the words back into a single string
    preprocessed_text = " ".join(filtered_words)
    return preprocessed_text


def analyze_sentiment(text):
    preprocessed_text = preprocess_text(text)
    result = sentiment_analysis(preprocessed_text)
    return result


if __name__ == "__main__":
    # Assume comments are passed as a single string in the first argument
    text = sys.argv[1]
    sentiment = analyze_sentiment(text)
    print(json.dumps(sentiment))
