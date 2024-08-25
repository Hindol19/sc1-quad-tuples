import json
import torch
from transformers import BertTokenizer, BertForSequenceClassification, pipeline
from gensim import corpora
from gensim.models import LdaModel
import os
import random

class Diagnos:
    # Define file paths
    model_save_path = os.path.join("..", "models", "model", "bert_psychological_state_model.pth")
    tokenizer_save_path = os.path.join("..", "models", "model", "bert_tokenizer")
    lda_model_save_path = os.path.join("..", "models", "model", "lda_model")
    dictionary_save_path = os.path.join("..", "models", "model", "lda_dictionary.dict")
    sentiment_pipeline_save_path = os.path.join("..", "models", "model", "sentiment_analysis_pipeline")

    recommendations_file_path = os.path.join('..', 'models', 'data', 'recommendations.json')

    # Load the BERT model
    model = BertForSequenceClassification.from_pretrained('bert-base-uncased', num_labels=5)
    model.load_state_dict(torch.load(model_save_path))
    model.eval()

    # Load the tokenizer
    tokenizer = BertTokenizer.from_pretrained(tokenizer_save_path)

    # Load the LDA model and dictionary
    lda_model = LdaModel.load(lda_model_save_path)
    dictionary = corpora.Dictionary.load(dictionary_save_path)

    # Load sentiment analysis pipeline
    sentiment_pipeline = pipeline("sentiment-analysis", model=sentiment_pipeline_save_path, tokenizer=sentiment_pipeline_save_path)

    # Load JSON file
    with open(recommendations_file_path, 'r') as file:
        responses_data = json.load(file)

    # Define analysis functions
    def analyze_sentiment(text):
        return Diagnos.sentiment_pipeline(text)

    def classify_psychological_state(text):
        inputs = Diagnos.tokenizer(text, return_tensors="pt")
        outputs = Diagnos.model(**inputs)
        predictions = torch.sigmoid(outputs.logits).detach().numpy().flatten()  # Flatten the array
        return predictions

    def analyze_topics(text):
        bow = Diagnos.dictionary.doc2bow(text.split())
        topics = Diagnos.lda_model.get_document_topics(bow)
        return topics

    def analyze_text(text):
        sentiment = Diagnos.analyze_sentiment(text)
        predictions = Diagnos.classify_psychological_state(text)
        topics = Diagnos.analyze_topics(text)
        
        return {
            'sentiment': sentiment,
            'predictions': predictions,
            'topics': topics
        }

    def provide_recommendations(predictions, sentiment):
        states = ["stress", "anxiety", "fear", "depression", "general"]
        
        # Find the index of the most significant psychological state
        max_index = predictions.argmax()
        max_state = states[max_index]
        
        # Retrieve the relevant recommendations
        recommendations = Diagnos.responses_data.get(max_state, {}).get('solutions', [])
        
        # Select two random recommendations from the most significant state
        if len(recommendations) >= 2:
            random_recommendations = random.sample(recommendations, 2)
        else:
            random_recommendations = recommendations  # In case there are fewer than 2 recommendations
        
        return random_recommendations

    def generate_report_dict(text, analysis_result, recommendations):
        sentiment = analysis_result['sentiment'][0]['label']
        sentiment_score = analysis_result['sentiment'][0]['score']
        predictions = analysis_result['predictions']
        topics = analysis_result['topics']

        report = {
            "Input Text": text,
            "Analysis Results": {
                "Sentiment": {
                    "label": sentiment,
                    "score": sentiment_score
                },
                "Psychological States": {
                    "Stress": predictions[0] * 100,
                    "Anxiety": predictions[1] * 100,
                    "Fear": predictions[2] * 100,
                    "Depression": predictions[3] * 100,
                    "Other": predictions[4] * 100
                }
            },
            "Recommendations": recommendations
        }
        
        return report

    def get_analysis_with_recommendations(text):
        analysis_result = Diagnos.analyze_text(text)
        recommendations = Diagnos.provide_recommendations(
            predictions=analysis_result['predictions'], 
            sentiment=analysis_result['sentiment']
        )
        return {
            'analysis': analysis_result,
            'recommendations': recommendations
        }

# # Take single input from user
# user_input = input("Please enter your text: ")

# # Analyze the input and generate report
# result = Diagnos.get_analysis_with_recommendations(user_input)
# report_dict = Diagnos.generate_report_dict(user_input, result['analysis'], result['recommendations'])

# # Print the report dictionary
# print(json.dumps(report_dict, indent=2))
